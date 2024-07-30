import { FastifyInstance } from "fastify";
import { Global } from "./global.model";
import { RequestData } from "@@types/request";
import { TestUser } from "@@modules/testuser/user.model";


export const GlobalService = (instance: FastifyInstance) => {

  const service = {
    seed: async (dto: RequestData<unknown>) => {
      const password = await dto.request?.hash(instance.configs.admin.password);
      const data: any = [
        {
          model: TestUser,
          payload: [
            {
              // id: 1,
              email: "admin@admin.com",
              name: "ADMIN",
              password,
              isAdmin: true,
              can_add: true,
              can_edit: true,
              verified: true
            }
          ]
        }
      ]
      for await (const row of data) {
        if (row.model.tableName != "test_user") {
          let optoins = {
            force: false
          }
          await row.model.sync(optoins);
          await row.model.bulkCreate(row.payload, { logging: false, ignoreDuplicates: true });
        } else {
          const isAdmin = await TestUser.findOne({
            where: {
              isAdmin: true
            }
          })
          if (!isAdmin) {
            let optoins = {
              force: false
            }
            await row.model.sync(optoins);
            await row.model.bulkCreate(row.payload, { logging: false, ignoreDuplicates: true });
          }
        }
      }
      return {
        done: true
      }
    }
  }
  return service
} 