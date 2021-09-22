# Vuetify CC

This repo offers a starting point for projects that use VueJS Framework for client side development. 

Keys | Description
----- | -----------
vcc | Vuetify-CC - Vuetify Cookie Cutter

## Resources

[Vue CLI](https://cli.vuejs.org/)

[VueJS](https://vuejs.org/)

[Vuetify](https://vuetifyjs.com/en/)

[Vuex](https://vuex.vuejs.org/)

[Nodeenv](https://github.com/ekalinin/nodeenv)
<!-- []() -->

## Development environment

### node

There are several ways to get a node environment. Method described here uses **nodeenv**

See [Configuration Reference](https://github.com/ekalinin/nodeenv).

### Installing nodeenv

*nodeenv* is a Python package similar to *virtualenv*

```sh
# Install nodeenv. You may need root permission.
pip install nodeenv

# At this writing, node 8.x is the long term support, so it is the recommended version to use.
# To see a list of available node versions.
nodeenv --list

# Create your node virtual environment.
nodeenv --node=8.16.0 env-project-name

# Activate your environment.
# NOTE: Use this command when you return to work on your project.
source env-project-name/bin/activate
```

### Project setup

#### Clone project

Clone the repository to your desired project name.

```sh
git clone https://github.com/crcresearch/vuetify-cc.git project-name-vuetify-cc
```

#### New GitHub repo.

Create a new, empty GitHub repo for your new project.

#### Delete '.git' from current vcc

This step allows you to switch the source of your repository to your new project repository.

**NOTE: origin will be your newly created repo**

```sh
cd project-name-vuetify-cc

git init

# Follow instructions to add a new repository.
```

#### .env.local

This .env is for environment variables used in the vcc. Here are the variables.

*NOTE: In order to use variables in the applicaton, the variables must start with VUE_APP_*

Keys | Description
----- | -----------
VUE_APP_AXIOS_BASE_URL | Base URL to use in axios.
VUE_APP_GRANT_TYPE | django oauth2 token.
VUE_APP_CLIENT_ID | django oauth2 token.
VUE_APP_CLIENT_SECRET | django oauth2 token.

*NOTE: Review droneci documentation of how to include these variables in the build image.*

#### Install the project requirements
```sh
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Run your tests
```
npm run test
```

#### Lints and fixes files
```
npm run lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Design

Vuetify CC is designed following the best practices. In other words, design considerations closely follow the recommended instructions for the frameworks and any additional libraries/packages used on the project.

## Vue Notification

https://github.com/euvl/vue-notification/

### Usage

```js
  this.$notify({
    title: 'Important message',
    text: 'Hello user! This is a notification!',
    duration: 10000,
    type: 'error|success|warn|info'
  });
```

**NOTE: Type can be 'success' (green), 'warn' (yellow), 'error' (red), or just left blank (blue)***

## Extra CSS

BVCC is Bootstrap + VueJS. By design (bootstrap-vue), all elements and css available in Bootstrap CSS are also available to you in BVCC. All the CSS packages listed below are available to you out of the box in BVCC.

### Bootstrap

Currently using v4.x

https://getbootstrap.com/

### Fontawesome

If you want to use fancy icons, use fontawesome. 

https://fontawesome.com/icons?d=gallery&m=free

### Tailwind

For fine grained css work, use utility library tailwind CSS. 

https://tailwindcss.com/

**NOTE: Because of conflicts, tailwind has been namespaced. Use 'tw-' for any tailwind classes you want to use in BVCC.**

### Theming

**BootstrapVue Reference:** https://bootstrap-vue.js.org/docs/reference/theming/#default-theme-colors

**Bootstrap Reference:** https://getbootstrap.com/docs/4.3/getting-started/theming/

Use these reference to find which variables to modify. Once you know which variables to use, got to *assets/css/custom.scss* to add your variables. NOTE: Your variables must be above the *@import* lines in the file. See the commented out examples.



## File structure

* src
  * assets: Images that ship with the package. For example, your logo.
  * components: Reusable components.
    * backend (change name to dashboard)
      * Navbar.vue
      * Footer.vue
    * frontend
      * Footer.vue
      * Navbar.vue
    * dialogs - General purpose dialogs.
      * LoadingDialog.vue
      * LoginDialog.vue
      * MessageDialog.vue
    * mixins
      * BaseAlertMixin.vue (no longer needed)
      * BaseDialogMixin.vue
  * layout
    * DashboardBaseTemplate.vue
    * BaseTemplate.vue
    * BlankBaseTemplate.vue
  * plugins: plugin definitions
  * readme: Documentation for the project.
    * README.md: This file. Instructions on the project and how to get started.
  * pages: Pages in our app. These are linked to in the *router.js* file.
    * About.vue
    * Home.vue
    * Login.vue
    * PageNotFound.vue
  * App.vue: Template entry point for the application.
  * utilities - Tools used throughout the application.
    * http-common.js: Customized axios instance. Sets the *Authorization* header if one is present.
    * handle-errors.js Handles axios errors returned from server.
  * main.js: Application entry point and initial configuration.
  * router.js: Application routes. Links a *route* to a *page*.
  * store: Application storage driven by vuex. Allows sharing of data across pages and components.
    * store.js Main store (vuex) entry point.
    * modules - Other 'stores' that are included in the main 'store.js'. Use to segment work.
      * dialog.js
      * sample.js - Use this as a template for other store modules.
      * user.js - Manage user data.
  * README.md: Project specific documentation.

### 
