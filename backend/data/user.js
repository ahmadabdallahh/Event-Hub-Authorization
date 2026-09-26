const { hash } = require('bcryptjs');
const { v4: generateId } = require('uuid');

const { NotFoundError } = require('../util/errors');
const { readData, writeData } = require('./util');

async function add(data) {
  const storedData = await readData();
  const userId = generateId();
  const hashedPw = await hash(data.password, 12);
  if (!storedData.users) {
    storedData.users = [];
  }
  storedData.users.push({ ...data, password: hashedPw, id: userId });
  await writeData(storedData);
  return { id: userId, email: data.email };
}

async function get(email) {
  const storedData = await readData();
  if (!storedData.users || storedData.users.length === 0) {
    throw new NotFoundError('Could not find any users.');
  }

  const user = storedData.users.find((ev) => ev.email === email);
  if (!user) {
    throw new NotFoundError('Could not find user for email ' + email);
  }

  return user;
}

async function updatePassword(email, newPassword) {
  const storedData = await readData();
  const user = (storedData.users || []).find((u) => u.email === email);
  if (!user) {
    throw new NotFoundError('Could not find user for email ' + email);
  }
  user.password = await hash(newPassword, 12);
  await writeData(storedData);
}

exports.add = add;
exports.get = get;
exports.updatePassword = updatePassword;
