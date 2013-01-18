require('ember-handlebars/ext');

/**
@module ember
@submodule ember-handlebars
*/

/**
  `template` allows you to render a template from inside another template.
  This allows you to re-use the same template in multiple places. For example:

  ```html
  <script type="text/x-handlebars" data-template-name="logged_in_user">
    {{#with loggedInUser}}
      Last Login: {{lastLogin}}
      User Info: {{template "user_info"}}
    {{/with}}
  </script>
  ```

  ```html
  <script type="text/x-handlebars" data-template-name="user_info">
    Name: <em>{{name}}</em>
    Karma: <em>{{karma}}</em>
  </script>
  ```

  This helper looks for templates in the global `Ember.TEMPLATES` hash. If you
  add `<script>` tags to your page with the `data-template-name` attribute set,
  they will be compiled and placed in this hash automatically.

  You can also manually register templates by adding them to the hash:

  ```javascript
  Ember.TEMPLATES["my_cool_template"] = Ember.Handlebars.compile('<b>{{user}}</b>');
  ```

  @method template
  @for Ember.Handlebars.helpers
  @param {String} templateName the template to render
*/

Ember.Handlebars.registerHelper('template', function(name, options) {
  var template = Ember.TEMPLATES[name];

  Ember.assert("Unable to find template with name '"+name+"'.", !!template);

  Ember.TEMPLATES[name](this, { data: options.data });
});

Ember.Handlebars.registerHelper('partial', function(name, options) {
  var nameParts = name.split("/"),
      lastPart = nameParts[nameParts.length - 1];

  nameParts[nameParts.length - 1] = "_" + lastPart;

  var underscoredName = nameParts.join("/");

  var template = Ember.TEMPLATES[underscoredName],
      deprecatedTemplate = Ember.TEMPLATES[name];

  Ember.deprecate("You tried to render the partial " + name + ", which should be at '" + underscoredName + "', but Ember found '" + name + "'. Please use a leading underscore in your partials", template);
  Ember.assert("Unable to find partial with name '"+name+"'.", template || deprecatedTemplate);

  template = template || deprecatedTemplate;

  template(this, { data: options.data });
});
