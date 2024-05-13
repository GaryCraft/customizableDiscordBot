# Environment Variables

UtilityDust supports many environment variables to customize its behavior. The following is a list of all the environment variables that UtilityDust supports:

## General
- `NODE_ENV`: The environment in which the application is running. Can be `development` or `production`. If not set, UtilityDust will default to `production`.

## Configuration
- `UD_CONFIG_PATH`: The path to the configuration directory. If not set, UtilityDust will use the default configuration directory. Which is `config` in the working directory.
  > It will be ignored if NODE_ENV is set to `development`.
- `UD_ALLOW_INSECURE_CONFIG`: If set to `true`, UtilityDust will allow insecure configurations. If not set, UtilityDust will not allow insecure configurations.
  > It will be ignored if NODE_ENV is set to `development`.

# Inherited Environment Variables

As UtilityDust is built on top of many libraries, it also inherits some environment variables from them. You can check the documentation of each library to see which environment variables are inherited.

- [Parzival](https://gitlab.com/spaceproject_/parzival)