import { prop, Typegoose, staticMethod, plugin } from 'typegoose';
import * as mongoose from 'mongoose';
import { IUser } from './user';
import Order from './order';

mongoose.connect('mongodb://localhost:27017/test');

const myPlugin = (schema: mongoose.Schema) => {
  schema.methods.log = function () {
    console.log(schema.path('name').path);
    return this;
  };
};

@plugin(myPlugin)
export class User extends Typegoose implements IUser {
  @prop()
  name: string;

  @prop({ref: 'Order'})
  order: string | mongoose.Schema.Types.ObjectId | typeof Order;
}

const UserModel = new User().getModelForClass(User, {
  existingMongoose: mongoose,
  schemaOptions: <mongoose.SchemaOptions>{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
});

const names: string[] = [
  'John Doe',
  'Jane Smith',
  'Kim Park',
  'Juan Perez',
  'Juanita de la Cruz'
];

// UserModel is a regular Mongoose Model with correct types
(async () => {
  const u = new UserModel({ name: names[Math.floor(Math.random() * names.length)] });
  let user = await u.log().save();

  // prints { _id: 59218f686409d670a97e53e0, name: 'JohnDoe', __v: 0 }
  console.log(user);

  const o = new Order({ amount: Math.floor(Math.random() * 100) });
  const order = await o.save();
  user.order = order;
  await user.save();
  user = await UserModel.findById(u._id).populate('order').exec();
  console.log(user);
})();