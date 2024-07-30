import { RequestData } from "@@types/request";
import { FastifyInstance } from "fastify";
import { ILogin, IRefreshTokenBody, IResponse, UserResponse } from "./auth.dto";
import { Role } from "@@types/enums";
import { TestUser } from "@@modules/testuser/user.model";


export const UserService = (instance: FastifyInstance) => {

  const privateMethods = {
    generateTokens: (user: TestUser, role: string) => {
      const payload: IResponse = {
        id: user.id,
        email: user.email,
        verified: user.verified,
        role: Role[role]
      };

      const accessToken = instance.jwt.sign(payload, {
        expiresIn: instance.configs.jwt.expire,
      });
      const refreshToken = instance.jwt.sign(payload, {
        expiresIn: instance.configs.jwt.refreshTokenExpire,
      });
      return { accessToken, refreshToken };
    },
    tokenResponse: (restaurant:TestUser, role: string,) => {

      const response = UserResponse(restaurant);

      const { accessToken, refreshToken } =
        privateMethods.generateTokens(restaurant, role);

      response.accessToken = accessToken;
      response.refreshToken = refreshToken;
      response.role = Role[role];
      response.verified = restaurant.verified
      // console.log({ response });

      return response
    },
  }

  const services = {
  
    login: async (dto: RequestData<ILogin>) => {
      const data = dto.data
      const user = await TestUser.findOne({
        where: {
          email: data.email.toLocaleLowerCase().trim()
        }
      })
      if (!user)
        throw instance.httpErrors.unauthorized('Wront creds')

      const passwordMatch = await dto.request!.verify(
        data.password.trim(),
        user.password
      )
      if (!passwordMatch)
        throw instance.httpErrors.conflict('Wront creds')
      let response = privateMethods.tokenResponse(user, 'user')
      return response
    },

    refreshToken: async (dto: RequestData<IRefreshTokenBody>) => {
      const { token } = dto.data;
      const payload = instance.jwt.decode(token) as IResponse;
      if (!payload) throw instance.httpErrors.conflict('');

      if (payload.role == "user") {

        const user = await TestUser.findOne({
          where: {
            id: payload.id,
            email: payload.email
          },
        })

        if (!user) {
          throw instance.httpErrors.notFound()
        }
        const response = privateMethods.tokenResponse(user, payload.role)
        return response

      } else {
        throw instance.httpErrors.conflict('');
      }

    },



  }

  return services

}