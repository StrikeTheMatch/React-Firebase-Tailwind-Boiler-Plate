declare module 'firebaseui' {
  import * as firebase from 'firebase/app';

  namespace firebaseui {
    interface AuthUI {
      start(containerSelector: string, config: any): void;
    }

    namespace auth {
      class AuthUI {
        constructor(auth: firebase.auth.Auth);
        start(containerSelector: string, config: any): void;
      }
    }
  }

  export = firebaseui;
}