const users = [
  {
    id: '0123-0123',
    username: 'clarencenpy',
    token: 'secret-token-a',
  },
  {
    id: '1111-1111',
    username: 'evans',
    token: 'secret-token-b',
  },
];

const User = {
  getAll() {
    return users;
  },
  getById(id) {
    return users.find(user => user.id === id);
  },

  // mock a simple authentication mechanism with an API
  // token passed via authorization headers
  authenticateWithToken(token) {
    return users.find(user => user.token === token);
  },
};

export default User;
