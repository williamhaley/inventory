[![Build Status](https://semaphoreci.com/api/v1/willhaley/inventory/branches/master/badge.svg)](https://semaphoreci.com/willhaley/inventory)

# Inventory

Simple inventory management system.

# Prerequisites

1. [eb](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html) client
	1. `pip install --upgrade --user awsebcli`
1. [nvm](https://github.com/creationix/nvm/blob/master/README.markdown#install-script)
1. [Node.js](https://nodejs.org/en/)
	1. `nvm install 6.9.4`
	1. `nvm use 6.9.4`

# Development

```
npm install
npm start
```

# Environments

`prod-env` is the only/default environment right now.

Create new environments with `eb create <env-name>`. Look into [templates, and saving configurations](https://aws.amazon.com/blogs/devops/using-the-elastic-beanstalk-eb-cli-to-create-manage-and-share-environment-configuration/), if necessary.

# Deploy

## CI

Deployments are automatically done via Semaphore CI.

## Manual

```
# Deploy current commited work
eb deploy
```

```
# Specify a label. Perhaps `master-$(git rev-parse --short HEAD)`.
eb deploy <env> --label="some human readable"
```

Environemnts can be associated with branches like so.

```
git checkout master
eb use <prod-env>
git checkout staging
eb use <staging-env>
```

# Reading

* [.ebextensions Node.js options](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-specific.html#command-options-nodejs)
* [AWS Node.js eb bootstrap guide](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs_express.html)
* [Node.js websockets](https://www.npmjs.com/package/ws)

# TODOs

Ask Ryan, would you rather see thirty entires for Sony Panasonic, but be able to filter, or categories for cameras, or one big list?

Is it all about speed?  I'm checking out, I want to do it in two clicks, no typing.  Like, drill down to categories, or just see list and scroll, or type and filter things?  What are his users going to want to do?

Would he rather have an individual photo for each item, or a generic image for "Camera" and that's fine.  Or maybe halfway there?  Like, an image for all panasonics?  How fine grained does it have to be?

Images for the users/equipment?

At it's most basic, what is this about?  Accountability?  Who checked out what so we know who to blame?  When did they do it?  Track the history based on item?  Probably.

Is it here or not?  Who has it?  When is it back?

Reservations.  Second wave.

Should there be a field on equipment like equipment.latestInfo = {} and it's just set to the value of the latest in the array?
And then we can have a concept of reservations?  Just look at that field and say "if not set" oh yeah, just null it when it's returned.  if it's out, then it's set and has data, if it's reserved, then we see it has an expectedCheckoutDate or something ?

Also, maybe the ability to change the exptected checkout date and expected return dates?  I'm assuming it should be tied to a user in the case of a reservation

Idea that things can be grouped together in a package.  Maybe just a free-form tagging system?  Can use that to associate equipment together, and can also use that for finding things later...

TODO
-Should not be able to delete user if they have equipment checked out.  Cannot delete equipment if checked out. Should have check for that server and client side.
-After creating a user, navigate to their detail page
-Handle errors better.  What catches users/undefined if we have a bad id (for example)?
-Free form text filter/search on title of equipment
-Make sure all forms are actually forms.  Save button is submit.  Other buttons are type="button"
-Handle server errors.  Big caveat, invalid ids when instantiating a MongoID can crash the app easily
-Ensure data integrity is accurate.  Add a user, shows up when going to check out equipment?  Make sure we understand and are accurate in when we're fetching data, order of fetch vs render.
-Make sure fonts, line heights are sane.  LAF on tag auto complete
-Poll for changes so everyone's in sync at once
-Add model validation using Backbone's built in system
-I'm afraid of what might happen if two people update the same model at once.  Instead of tags being appended, tags will be overwritten by one or the other?  Maybe just a matter of not blindly saving any attribute onto the model on the backend?  Only allow explicity fields.  set {name: model.name, note: model.note} and then do some logic on the tags.

Features
-Can just drop the time from reservations, or at least make it not required.  For JS should make sure we have the date, validate on that, time is a bonus
-Free form search for tags and names
-Redirect to user page after checkout so they can see what they just checked out.  "receipt page" is helpful for them.  That they can print out a list of equipment they just checked out so if they're on the road they have a physical list of what equipment they should have.

TODO
When checking out multiple equipment, I should be able to do .where() on an existing collection to get what I need rather than fetching, righT?

Ability to check in multiple items at once.  I don't think it should be a "select all" because you can have multiple categories, not all necessarily part of one check-out, so should force users to selectively choose what they're checking in

Sort equipment alphabetically

Maybe whenever checking out a group can add something like checkoutGroupId and can use that to group equipment later for checkin.  Like hey, this is all the equipment you previously checked out together.  Maybe you want to check it all in together?


### Installing on Windows
- App
  - Install Windows GitHub GUI
  - Sync repo.  Close GitHub GUI
  - Create C:\inventory\src and move project files there
  - Re-open GitHub GUI.  When it says it can't find the project, specify the new location
- MongoDB
  - Download MongoDB binaries in zip and extract to C:\inventory\mongodb
- NodeJS
  - Download nodejs binary and extract to C:\inventory\nodejs
  - Download npm binaries from http://nodejs.org/dist/npm/ and extract into C:\inventory\nodejs
  - Add C:\inventory\nodejs\node_modules directory as environment variable NODE_PATH and reboot
- Execute `windows-setup.bat` to create a few directories and startup scripts
- To start the App, run `start-database.bat` then `start-webserver.bat`

I would rather install MongoDB as a Windows service, but there are some issues - https://groups.google.com/forum/#!topic/mongodb-user/lUcvyBXH6y0
