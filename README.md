# Cocktailogue &nbsp;&nbsp;&nbsp;<a href="https://app.netlify.com/start/deploy?repository=https://github.com/jeremywynn/Cocktailogue"><img src="https://www.netlify.com/img/deploy/button.svg"></a>

An app to import Saved Instagram posts for archiving purposes with the added benefits of being able to title them, edit them, and search through them. For my use case, I save posts about Cocktail recipes.

### Setup may only be for the _brave_.

Ultimately, you will need to set up these 5 environment variables:

IMAGEKIT_API_SECRET  
IMAGEKIT_ID  
IMAGEKIT_PUBLIC_API_KEY  
MONGODB_API_KEY  
MONGODB_STITCH_APP_ID

## MongoDB

#### Create a MongoDB database

1. Create a free cluster on [MongoDB](https://www.mongodb.com/) (create an account using the Try Free if you don't have one).
2. Once the cluster has finished building, click on the "Collections" button, then click on the "Add my own data" button on the next screen.
3. Click the "Connect" button.
4. In the modal window that appears, click the "Choose a connection method" button near the bottom right and choose "Connect Your Application"

## MongoDB Stitch

#### Create a MongoDB Stitch Application using the MongoDB Cloud Interface

1. Click the "Stitch" link in the left-hand menu, then click the "Create New Application" button.
2. In the modal window that appears, give your Application a name under the "Application Name" field, then leave everything else and click the "Create" button.
3. Under Step 3 (Execute a Test Request), the App ID you can copy will be the value you need for **MONGO_STITCH_APP_ID**. Create this environment variable in Netlify (Settings -> Build & Deploy -> Environment).

#### Create a MongoDB Stitch User

1. On the mongoDB Stitch homepage, click the "Users" link under the Control section, then click the "Providers" tab.
2. Click the "Actions" button on the row corresponding to the Provider "API Keys".
3. Click the Provider Enabled form control to "On" and then use the "Create API Key" using any Name you like, then click the "Save" button right underneath the Name input.
4. This area will update with an API key that you can copy. You will need this value for the **MONGODB_API_KEY** environment variable. Create this environment variable in Netlify (Settings -> Build & Deploy -> Environment).
5. Click the green "Save" button at the right-hand side after you have copied this key value.
6. It can also be helpful to click the "Review & Deploy Changes" button on the top blue notification that appears anytime you make a change in MongoDB Stitch. Doing so should make your changes effective.

## ImageKit

1. Create a free [ImageKit](https://imagekit.io/) account using the "Sign Up" link.
2. After completing the necessary steps to verify your account via email, specify an **IMAGEKIT ID** (or use the generated one given). This will be the value of the **IMAGEKIT_ID** environment variable.
3. Select any REGION you desire and click the "Next" button.
4. On the next screen, you may select the "Upload to ImageKit Storage" option.
5. On the main screen, click the "Developers" link to view your API KEYS. The Public Key value will be needed for the **IMAGEKIT_PUBLIC_API_KEY** variable and the Private Key value will be needed for the **IMAGEKIT_API_SECRET** variable.
6. Make sure you create those 3 ImageKit environment variables in Netlify.

## Netlify Identity

Before you can Add, Edit, or Delete items, you will need to create a Netlify Identity user.

1. Go to "Identity" in Netlify and click the "Enable Identity" button.
2. Use the "Invite Users" button to create a user and finish the process.
3. When you are successfully logged in, all greyed out buttons on the app should now be activated and not trigger login prompts. *(Try relogging if the action buttons are still disabled/greyed out.)*

## Using the App

### Adding Items

Use the "+" button to add an Item. You will need a JSON file of the item from [Instaloader](https://instaloader.github.io/). Choose your method of [installation](https://instaloader.github.io/installation.html). Follow the [Command Line Options](https://instaloader.github.io/cli-options.html) guide to create JSON files. Here is an example:

```instaloader :saved --login username --no-compress-json"```

Replace *username* with your Instagram username, and then input your Instagram password when it prompts you. If successful, a login session will be created where Instaloader will create JSON files, one for each post, in a separate directory.

When you have a JSON file to add, use the file input (Browse) control to select the JSON file. Its text and image(s) will appear (although Instagram's image URL signatures can expire), you will be able to have a title for the Item (it will default blank since Instagram posts don't have titles), and then you can add it using the "Add Item" button.

For best results, do not use Firefox since it does not seem to respect natural line breaks (newlines) like Chrome does. If you need example JSON files, see the /assets/json folder.

### Local Dev

To use this in a local environment, you will need to create an .env file at the root directory of the project that contains the 5 environment variables.

## Roadmap

Lots. Lots...