![QuizApp Logo](/images/readme/QuizApp_logo.png)

# QuizApp

![Screenshot 1](/images/readme/quiz-app-1.jpg)
![Screenshot 2](/images/readme/quiz-app-2.jpg)

[Angular v5](https://github.com/angular/angular) app using the reactive libraries [@ngrx](https://github.com/ngrx/platform) and the [Bulma](https://bulma.io) CSS framework.
The quizzes and questions are retrieved from the [QuizServer](../quiz-server/README.md) JSON backend. 

Angular concepts/techniques used:
- [Reactive Forms](https://angular.io/guide/reactive-forms)
- [Internationalization (i18n)](https://angular.io/guide/i18n)
- [Route guards](https://angular.io/guide/router#milestone-5-route-guards)

[@ngrx](https://github.com/ngrx/platform) features used:
- [@ngrx/store](https://github.com/ngrx/platform/blob/master/docs/store/README.md) for state management
- [@ngrx/effects](https://github.com/ngrx/platform/blob/master/docs/effects/README.md) for side effects
- [@ngrx/router-store](https://github.com/ngrx/platform/blob/master/docs/router-store/README.md) for connecting the Angular router
- [@ngrx/entity](https://github.com/ngrx/platform/blob/master/docs/entity/README.md) as entity state adapter
- [ngrx-store-localstorage](https://github.com/btroncone/ngrx-store-localstorage) for using the local storage in state management

Other packages used:
- [angular2-uuid](https://github.com/wulfsolter/angular2-uuid) for generating UUIDs
- [angular-sortablejs](https://github.com/SortableJS/angular-sortablejs) for reorderable drag-and-drop lists


## 🎬 Installation
```sh
git clone https://github.com/TODO
cd ng2d-quiz-app
npm install
```


## 🎛 Configuration
In `src/environments/environment.[prod].ts` you may change the `apiEndpoint` of the corresponding backend and the `colors` used:
```typescript
export const environment = {
  ...,
  apiEndpoint: 'https://script.google.com/macros/s/AKfycbzqMQJLt49HZcOgAYItiv2GljX5SfyMs0A5KTSUVwq3idDbweez/exec',
  colors: [
    '#540D6E',
    '#EE4266',
    '#FFD23F',
    '#3BCEAC',
    '#0EAD69',
  ],
};
```

In `src/variables.scss` you may change the color scheme:
```scss
$color-primary: #3BCEAC;
$color-secondary: #29a588;
$color-text: #494949;
$color-gray: #959595;
$color-light-gray: #959595;
$color-correct: #00aa00;
$color-incorrect: #aa0000;
```



## 🌍 i18n
If you want to add a new language, i.e. french:

1. Run `ng xi18n`.
2. Copy newly generated file `src/messages.xlf` to `src/locale/messages.fr.xlf` and add `<target>...</target>` for each `<source>...</source>`.
3. Serve for test: `ng serve --aot --locale fr --i18n-format xlf --i18n-file src/locale/messages.fr.xlf`


## 🚀 Build
Build for production:

`ng build --prod`

Using the german locale (`src/locale/messages.de.xlf`):

`ng build --locale de --i18n-format xlf --i18n-file src/locale/messages.de.xlf --prod`


## ☑️ TODOs
- Use Bulma v0.6.3 when published (warning messages when building, [Bulma issue #1190](https://github.com/jgthms/bulma/issues/1190)).
