# .drone.yml description

## General info

## Inline comments.

```yml

kind: pipeline
name: default

workspace:
  base: /go
  path: src/github.com/crcresearch/aegis-bvcc

steps:
  -- Name of the step.
  - name: publish_develop
    image: plugins/docker
    -- Triggered only on develop branch.
    when:
      branch:
        - develop
      event:
        - push
    -- Use the following secret variables and map them to the environment variables.
    environment:
      VUE_APP_AXIOS_BASE_URL:
        from_secret: VUE_APP_QA_AXIOS_BASE_URL
      VUE_APP_GRANT_TYPE:
        from_secret: VUE_APP_QA_GRANT_TYPE
      VUE_APP_CLIENT_ID:
        from_secret: VUE_APP_QA_CLIENT_ID
      VUE_APP_CLIENT_SECRET:
        from_secret: VUE_APP_QA_CLIENT_SECRET
    settings:
      -- Define build environment variables.
      build_args_from_env:
        - VUE_APP_AXIOS_BASE_URL
        - VUE_APP_GRANT_TYPE
        - VUE_APP_CLIENT_ID
        - VUE_APP_CLIENT_SECRET
      -- username/password for the zazu registry.
      username:
        from_secret: DOCKER_REGISTRY_USERNAME
      password:
        from_secret: DOCKER_REGISTRY_PASSWORD
      -- Full path (domain + name) of where to put the created image.
      repo: zazu.crc.nd.edu/aegis/bvcc
      -- Domain to put the image.
      registry: zazu.crc.nd.edu
      -- Tag to give the image.
      tags: 'development'
  -- Name of step.
  - name: publish_master
    image: plugins/docker
    -- Triggered only on master branch.
    when:
      branch:
        - master
      event:
        - push
    -- Use different secrets and map them to the same environment variables.
    environment:
      VUE_APP_AXIOS_BASE_URL:
        from_secret: VUE_APP_PROD_AXIOS_BASE_URL
      VUE_APP_GRANT_TYPE:
        from_secret: VUE_APP_PROD_GRANT_TYPE
      VUE_APP_CLIENT_ID:
        from_secret: VUE_APP_PROD_CLIENT_ID
      VUE_APP_CLIENT_SECRET:
        from_secret: VUE_APP_PROD_CLIENT_SECRET
    settings:
      build_args_from_env:
        - VUE_APP_AXIOS_BASE_URL
        - VUE_APP_GRANT_TYPE
        - VUE_APP_CLIENT_ID
        - VUE_APP_CLIENT_SECRET
      username:
        from_secret: DOCKER_REGISTRY_USERNAME
      password:
        from_secret: DOCKER_REGISTRY_PASSWORD
      repo: zazu.crc.nd.edu/aegis/bvcc
      registry: zazu.crc.nd.edu
      -- Set it as the latest since it is from master.
      tags: 'latest'
  -- Name of the step.
  - name: publish_tag
    image: plugins/docker
    -- Triggered only when there is a tag.
    when:
      event:
        - tag
    environment:
      VUE_APP_AXIOS_BASE_URL:
        from_secret: VUE_APP_PROD_AXIOS_BASE_URL
      VUE_APP_GRANT_TYPE:
        from_secret: VUE_APP_PROD_GRANT_TYPE
      VUE_APP_CLIENT_ID:
        from_secret: VUE_APP_PROD_CLIENT_ID
      VUE_APP_CLIENT_SECRET:
        from_secret: VUE_APP_PROD_CLIENT_SECRET
    settings:
      build_args_from_env:
        - VUE_APP_AXIOS_BASE_URL
        - VUE_APP_GRANT_TYPE
        - VUE_APP_CLIENT_ID
        - VUE_APP_CLIENT_SECRET
      username:
        from_secret: DOCKER_REGISTRY_USERNAME
      password:
        from_secret: DOCKER_REGISTRY_PASSWORD
      repo: zazu.crc.nd.edu/aegis/bvcc
      registry: zazu.crc.nd.edu
      -- Use the GitHub repo tag to tag it.
      auto_tag: true

```
