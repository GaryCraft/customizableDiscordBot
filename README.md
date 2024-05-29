
# UtilityDust

## What is UtilityDust?

UtilityDust is an open source NodeJS Event-Based Application Engine. Made to be easy to use, and extend.
if you find any bugs or have any suggestions, please open an issue on the [GitHub Issues Tab](https://github.com/GaryCraft/UtilityDust/issues)

This engine is open source and is licensed under the [MIT License](https://opensource.org/licenses/MIT).

As Features are needed, they will be separated into modules, that can be easily installed.
So the main template remains clean and without bloat.

> [!WARNING]
> This project is still in early development, and while production use is viable, stuff mill most certainly break with future updates, until its API is deemed stable.

# Modules

## Included Modules in release branch

- [x] Discord Client
- [ ] Automatic bindings for TypeScript (WIP)

## Planned Modules, eventually available in the main branch

- [ ] WhatsApp Client
- [ ] Mattermost Client
- [ ] OCR Module
- [ ] Twitch Module
- [ ] Service Polling Module
- [ ] Orizuru Module
- [x] i18n Module (internal)

but you can also create your own modules, and publish them to npm.
we'll try to mantain the name format as `udm-<name>`
and have a quick way to install them.

# Default Configuration

The default configuration for UtilityDust is for a very simple discord bot, with probably a dashboard.
As it ships default with the discord client module, and the HTTP server configured to use a **public** directory.

# How to use

In the future there will be a way better documentation, but for now, you can browse the source code, and see how it works.
Specially the discord client module, as it is the most normalized as to how the application expects to be used.

## Docs

UtilityDust supports many environment variables to customize its behavior, so you can check the [Environment Variables](docs/env_vars.md) for more information.

## Making a module

The only thing you need to do to make a module, is to create a folder within the `modules` directory, and create an `index` file in it.
UtilityDust will automatically load it, expecting it to satisfy the Module type, with a respective configuration key, and eventEmitter class.

As so it only expects a name, a "hooksInnerPath", load and init functions, and a eventEmitter class.
Where

- the name is a unique string name
- the hooksInnerPath is a string that references the path to the hooks folder, relative to the module folder
- the load function is an async function that receives the configuration, and should return the EventEmitter inheritor instance
- the init function is an async function that receives the context, and should return nothing

Apart from that you can make any folder or file in the module folder, and it will be used only if needed.

## Hooks

Hooks in this context are functions that are called when a certain event happens.
They are used to extend the functionality of the application, without having to modify the engine itself.

## Routes

Routes are used to extend the HTTP server, and are used to handle requests.
The routes folder also determines the structure of the URL, check the example route for more information.
(the example route will be called if a request to /example is made)

## Tasks

Tasks are used to schedule functions to be called at a certain time.
you can check the example task for more information.

## Database

We use TypeORM for the database, so you can use any database supported by it.
Models will be loaded automatically, and you can use the database connection from anywhere in the application.
To configure the database, you can use the `database` key in the configuration file.

## Configuration

The configuration folder will be loaded starting at the index file, and parsed automatically.
It determines the structure of the configuration file using the parzival library.

Then the configuration file is loaded, then validated and parsed, if it is not valid, it will throw an error.

## Commands

UtilityDust by default has a CLI, that can be used to run commands.
You can add commands to the commands folder, and they will be loaded automatically.
