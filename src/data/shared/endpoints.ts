export const endpoints = {
  auth: {
    login: '/auth/signin',
    users: '/users',
    refresh: '/auth/refresh-token',
  },
  patients: {
    create: '/users/patients',
    getAll: '/users/patients',
    update: '/users/patients',
    getByID: '/users/patients',
  },
  roles: '/roles',
  status: '/status',
}
