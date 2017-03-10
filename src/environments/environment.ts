// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  BACKEND_BASE_URL: "http://localhost:8080/api",
  firebase_apiKey: "AIzaSyDGJt42caQMGiRJDg8z_0C_sWhy1NFlHJ0",
  firebase_authDomain: "eritis-be-dev.firebaseapp.com",
  firebase_databaseURL: "https://eritis-be-dev.firebaseio.com",
};
