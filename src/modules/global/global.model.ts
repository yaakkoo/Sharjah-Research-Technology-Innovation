import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: true,
  modelName: 'Global',
  tableName: 'globals',
  paranoid: true,
})
export class Global extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  declare id: number;




}
