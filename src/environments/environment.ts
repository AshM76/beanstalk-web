// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //API URL — points at the local beanstalk-api dev server. App code appends
  //the '/api/...' path segment, so baseUrl here is the origin only.
  baseUrl: 'http://localhost:8080',
  //IMAGES RESOURCES
  resourcesUrl: 'https://storage.googleapis.com/',
  //VERSION WEBAPP
  version: 'v.0.10',
  // Dev bypass: when true, AuthGuard/AdminGuard/RoleGuard all pass and
  // AccountService.getAdminUser() synthesizes a super-admin, so the admin
  // console opens without a real login (no BigQuery-backed admin auth
  // needed). Must stay false in environment.prod.ts.
  devBypassAuth: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.