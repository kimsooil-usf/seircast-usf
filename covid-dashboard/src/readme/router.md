# Vue Router

Document gives a summary of some of what VCC is doing with the vue router. Refer to the documentation below for background before reading this document. 

[Vue Router](https://router.vuejs.org/)

## Introduction

The first time *router.js* is loaded, several things happen.

- App is initialized by calling *initApp*.
- Authorization is added to the custom axios HTTP instance. This is initialized when *initApp* is called.

## Routing

VCC uses standard routing (REMINDER: VCC attempts to stay very close to best practices). Other than routing itself, two aspects of the VCC are calculated in the *router.js*.

- Authorization for certain routes.
- Determining the base template to use.

These two features are implemented using [Nested Routes](https://router.vuejs.org/guide/essentials/nested-routes.html), [Route Meta Fields](https://router.vuejs.org/guide/advanced/meta.html) and [Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html).

- Nested routes allow a route to be nested within another route. For example, a route '/user/profile' can be nested under '/user'. This allows for several things explained below.
- Route meta fields are extra information added to a route for use within navigation guards or within a component. For example, a meta field can be added requiring that a component requires authentication.
- Navigation guards allow guarding of a route by giving options to redirect, cancel or continue.

### Back/Front base Templates

In order to determine the base template, a meta field called *component* is used. In this case, there are two base templates. If a route *requires* a certain base template, include it in the *component* meta field. 

After this, the global navigation guard *beforeEach* checks and sets this field for every route that has this component. 

#### Nested Routes meta.

VCC has nested routes that correspond to the dashbaord part of the site. The dashboard route and (children) require the 'Back' base template. In this case, rather than set the *component* meta field for each nested route, it is sufficient to just set it in the *parent* route, which then applies this change to all other nested routes.

### Authentication

Authentication follows much the same method as the base templates. To require authentication for certain routes, use the *requiresAuth* meta field. NOTE: If this is set on a parent route, this will be applied to all nested routes. 