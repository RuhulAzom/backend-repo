import { db } from "../config/firebaseConfig";
import { CreateUserType, User } from "../entities/user";

const collection = db.collection("users");

export default {
  createUser: async (data: CreateUserType): Promise<User> => {
    const now = new Date();
    const userDoc = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await collection.add(userDoc);
    return {
      id: docRef.id,
      ...userDoc,
    } as User;
  },
};

export const createUser = async (data: CreateUserType): Promise<User> => {
  const now = new Date();
  const userDoc = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await collection.add(userDoc);
  return {
    id: docRef.id,
    ...userDoc,
  } as User;
};

export const findUserByEmail = async (email: string) => {
  const doc = await collection.where("email", "==", email).limit(1).get();
  if (!doc) return null;
  let data: User[] = [];
  doc.forEach((item) => {
    const userData = item.data();
    data.push({
      id: item.id,
      ...userData,
      createdAt: new Date(userData.createdAt._seconds * 1000),
      updatedAt: new Date(userData.updatedAt._seconds * 1000),
    } as User);
  });

  return data.length > 0 ? data[0] : null;
};

export const findUserById = async (id: string) => {
  const doc = await collection.doc(id).get();
  if (!doc) return null;
  return {
    id: doc.id,
    ...doc.data(),
  } as User;
};

export const findAll = async () => {
  const doc = await collection.get();
  let data: User[] = [];
  doc.forEach((item) => {
    const userData = item.data();
    data.push({
      id: item.id,
      name: userData.name,
      email: userData.email,
      createdAt: new Date(userData.createdAt._seconds * 1000),
      updatedAt: new Date(userData.updatedAt._seconds * 1000),
    } as User);
  });

  return data;
};

export const update = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<User>;
}) => {
  const now = new Date();
  await collection.doc(id).update({
    ...data,
    updatedAt: now,
  });
  return findUserById(id);
};

export const findTopUsers = async (): Promise<User[]> => {
  const doc = await collection
    .orderBy("totalAverageWeightRatings", "desc")
    .orderBy("numberOfRents", "desc")
    .orderBy("recentlyActive", "desc")
    .limit(10)
    .get();
  if (!doc) return [];
  let data: User[] = [];
  doc.forEach((item) => {
    const userData = item.data();
    data.push({
      id: item.id,
      ...userData,
      createdAt: new Date(userData.createdAt._seconds * 1000),
      updatedAt: new Date(userData.updatedAt._seconds * 1000),
    } as User);
  });
  return data;
};
