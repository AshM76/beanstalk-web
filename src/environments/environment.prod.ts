export const environment = {
  production: true,
  //API URL
  baseUrl: 'https://beanstalk.app',
  //IMAGES RESOURCES
  resourcesUrl: 'https://storage.googleapis.com/',
  //VERSION WEBAPP
  version: 'v.0.10',
  // Must remain false in prod. AuthGuard/AdminGuard/RoleGuard rely on this.
  devBypassAuth: false
};
