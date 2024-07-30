import { FastifyInstance } from 'fastify';
import { RequestData } from '../../types/request';
import { TestUser } from './user.model';
import { IEditPassword, IEditUser, INewUser, IUserID } from './user.dto';
import { Transaction } from 'sequelize';



export const TestService = (instance: FastifyInstance) => {
  const privateMethods = {

    checkEmail: async (email: string, transaction: Transaction, instance: FastifyInstance) => {
      const existedRestaurant = await TestUser.findOne({
        where: {
          email: email.toLocaleLowerCase().trim()
        },
        transaction
      });
  
      if (existedRestaurant) {
        throw instance.httpErrors.conflict('There is another user with this email');
      }
    },

    checkIfAdmin: async () => {
      const admin = await TestUser.findOne({
        where: {
          isAdmin: true
        }
      })
      if (admin) {
        throw instance.httpErrors.conflict("ADMIN IS ALREADY EXISTED")
      }
    },
    getUserById: async (id: number) => {
      const user = await TestUser.findOne({
        where: {
          id
        }
      })
      if (!user) throw instance.httpErrors.notFound("USER NOT FOUND")
      return user
    },
    checkAddPerm: async (id: number) => {
      const user = await privateMethods.getUserById(id)
      if (!user.can_add) throw instance.httpErrors.unauthorized()
    },
    checkEditPerm: async (id: number) => {
      const user = await privateMethods.getUserById(id)
      if (!user.can_edit) throw instance.httpErrors.unauthorized()
    },
    getAdmin: async (id: number) => {
      const admin = await TestUser.findOne({
        where: {
          id: id,
          isAdmin: true
        }
      })
      if (admin) {
        throw instance.httpErrors.notFound("ADMIN NOT FOUNd")
      }
      return admin
    },
    formatUser: (user: TestUser) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      date_of_birth: user.date_of_birth,
      emirate: user.emirate,
      isAdmin: user.isAdmin,
      can_edit: user.can_edit,
      can_add: user.can_add,
      address: user.address,
      home_city: user.home_city,
      home_country: user.home_country,
    })
  };

  const service = {
    getUsers: async (dto: RequestData<unknown>) => {
      const users = await TestUser.findAll()

      return {
        users: users
      }
    },
    createUser: async (dto: RequestData<INewUser>) => {
      const { data } = dto
      await privateMethods.checkAddPerm(dto.request!.user.id)
      if (data.isAdmin) await privateMethods.checkIfAdmin()
      const password = await dto.request!.hash(data.password);
      const transaction = await instance.db.transaction()
      try {
        await privateMethods.checkEmail(data.email, transaction, instance)
        const user = await TestUser.create({
          email: data.email,
          name: data.name,
          password: password,
          phone: data.phone,
          address: data.address,
          date_of_birth: data.date_of_birth,
          home_country: data.country,
          verified: true,
          home_city: data.city,
          isAdmin: data.isAdmin,
          can_add: data.isAdmin ? true : data.can_add,
          can_edit: data.isAdmin ? true : data.can_edit
        })
        await transaction.commit()
        return {
          user
        }
      } catch (error) {
        await transaction.rollback()
        throw error
      }

    },
    editUser: async (dto: RequestData<IEditUser>) => {
      const { data } = dto

      await privateMethods.checkEditPerm(dto.request!.user.id)
      const user = await privateMethods.getUserById(data.id)
      const transaction = await instance.db.transaction()
      try {
        if (data.email != user.email)
          await privateMethods.checkEmail(data.email, transaction, instance)
        await user.update({
          email: data.email,
          name: data.name,
          phone: data.phone,
          address: data.address,
          date_of_birth: data.date_of_birth,
          home_country: data.country,
          home_city: data.city,
          can_add: data.can_add,
          can_edit: data.can_edit
        }, {
          transaction
        })
        await transaction.commit()
        await user.reload()

        return {
          user
        }

      } catch (error) {
        await transaction.rollback()
        throw error
      }
    },
    editUserPassword: async (dto: RequestData<IEditPassword>) => {
      const { data } = dto
      const { userId } = dto.request!.params as IUserID

      await privateMethods.checkEditPerm(dto.request!.user.id)
      const user = await privateMethods.getUserById(userId)
      const password = await dto.request!.hash(data.password);

      await user.update({
        password
      })
      await user.reload()

      return {
        done : true
      }
    },
    deleteUser: async (dto: RequestData<unknown>) => {
      const { id } = dto.request!.user
      const { userId } = dto.request!.params as IUserID
      const user = await privateMethods.getUserById(userId)
      if(user.isAdmin) {
        throw instance.httpErrors.conflict("This is an admin, can not be deleted")
      }
      await user.destroy()
      return {
        done: true
      }
    },
  }
  return service
}
