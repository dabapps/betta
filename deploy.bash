#!/usr/bin/env bash
BRANCH=gh-pages
TARGET_REPO=dabapps/betta.github.io.git
DIST_FOLDER=output

echo -e "Testing travis-encrypt"
echo -e "$VARNAME"

# if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    echo -e "Starting deployment on Github Pages\n"
    if [ "$TRAVIS" == "true" ]; then
        git config --global user.email "manos@iamemmanouil.com"
        git config --global user.name "ekonstantinidis"
    fi

    #using token clone gh-pages branch
    git clone --quiet --branch=$BRANCH https://${GH_TOKEN}@github.com/$TARGET_REPO built_website > /dev/null

    #go into directory and copy data we're interested in to that directory
    cd built_website
    rsync -rv --exclude=.git  ../$DIST_FOLDER/* .

    #add, commit and push files
    git add -f .
    git commit -m "Travis build $TRAVIS_BUILD_NUMBER pushed to Github Pages"
    git push -fq origin $BRANCH > /dev/null
    echo -e "Deploy completed\n"
# fi
