# Initialize

Copy shadow.env to .env and fill in credential


# Build

In project root

```bash
sh build.sh
```
This will do the following:

    - build `frontend-src` project
    - run deploy-tools and move the buit static assets into the `/publc` dir from `/src` where the express app is server
    - build the express app
