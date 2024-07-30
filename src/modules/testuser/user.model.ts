import { Model, Column, Table, DataType, ForeignKey, BelongsTo, AfterCreate, AfterBulkCreate, HasMany } from 'sequelize-typescript'

@Table({
  paranoid: true,
  tableName: 'test_user',
  modelName: 'TestUser'
})
export class TestUser extends Model {

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare name: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare password: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare email: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare phone: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare address: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare emirate: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare date_of_birth: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare home_country: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare home_city: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  declare can_add: boolean
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  declare can_edit: boolean
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  declare verified: boolean
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  declare isAdmin: boolean

  
}
