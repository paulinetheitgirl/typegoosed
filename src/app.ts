import { prop, Typegoose, staticMethod, plugin } from 'typegoose';
import * as mongoose from 'mongoose';
import { IUser } from './user';

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
  name?: string;
}

const UserModel = new User().getModelForClass(User, {
  existingMongoose: mongoose,
  schemaOptions: <mongoose.SchemaOptions>{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
});

// UserModel is a regular Mongoose Model with correct types
(async () => {
  const u = new UserModel({ name: 'JohnDoe' });
  await u.log().save();
  const user = await UserModel.findOne();

  // prints { _id: 59218f686409d670a97e53e0, name: 'JohnDoe', __v: 0 }
  console.log(user);
})();