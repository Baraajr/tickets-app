import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; // Convert _id to id
        delete ret._id; // Remove _id from the response
        delete ret.password; // Remove password from the response
        delete ret.__v; // Remove version key from the response
      },
    },
  }
);
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.pre('save', async function (next) {
  // If the password is modified, hash it
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }
  next();
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
