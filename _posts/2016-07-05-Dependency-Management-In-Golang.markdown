---
layout: post
title: Why You Shouldn't Pretend to Be A Monorepo
categories: [Technology]
image: ibelonghere.jpg
---

Dependency management in Go has always worked quite differently from in other languages. Although Go baked in a standardised dependency management process, it seems to have been based on the authors' experience working in Google. Unfortunately, things work differently in Google than in other places, and so the default approach is disliked by the majority of developers. This has led to a reliance on ad hoc and third-party approaches, and as yet the community has not arrived at a de facto standard. This leaves the new Golang developer with some learning to do in order to choose the best tool for the job.
<!--more-->

## Default: *Go Get Github*

By default, Go dependencies are downloaded with `go get`. Go get will resolve all the package paths in your codebase as URLs pointing to Github, Bitbucket, Google or Golang repos. The project will be cloned and the package will be by default in the same state as the HEAD of the default branch. 

When using `go get`, dependencies are copied into a single tree structure under $GOPATH/src. The structure of this tree matches the package path / repo URL structure. So, on a single Go developers machine, there is a single version of each dependency as defined by the package path which will be used by each project depending on the package. 

### Problems Doing Open-Source Projects

There are a couple of problems with this. One I discovered while I was trying to maintain a fork of the [Terraform project](github.com/hashicorp/Terraform) [1]. This is a very large and active project with lots of dependencies. Every time I would do a build, new versions of the dependencies would be pulled in, and the build would break. Although there were many people around to fix the main repo, it was not uncommon for it to also be broken due for the same reason. In fairness to the Terraform contributors, this is no longer the case as they introduced vendored dependencies at the start of this year. 

Using single global versions of a package also caused difficulty in maintaining a fork. I was also at times using a forked version of a dependency of Terraform, and the solution to used forked packages is to rewrite all the import paths in your repo. This doesn't sound ideal, but what would happen was this:

  1. While making changes in my Terraform fork, I find a bug. Think that it doesn't seem like something specific to the changes I made, so decide to check Terraform master
  2. Checkout master and try to build, but build fails. 
  3. Realize that I also made changes to the dependency. Can't remember whether I made the import paths to point to the forked repo, or I cloned my forked repo in place of the original repo, so check the package paths in the Terraform source files. 
  4. Find I made my changes in the original dependency, so that could be why master doesn't build.
  5. Checkout master in the dependency and manage to build master.
  6. By this point, I forgot the problem I'd had that I was meant to be checking in master. 
If each package held some information about its own dependencies, making these kinds of forks that touch multiple repos would have been much easier.

There is one more problem that thankfully, I didn't encounter. Since repos on Github are not immutable, `go get` will fail if any project you're dependent on is deleted. So, #leftpadgate could also occur in Go projects. Although culturally, Go developers are less likely to import a load of small, arguably unnecessary, and more-likely-to-be-deleted dependencies, there was no protection in the toolchain. Until Go 1.6, that is, when [vendoring](https://blog.gopheracademy.com/advent-2015/vendor-folder/) was officially introduced.

### Why Its Like This

 Often the reason why things can seem difficult is that we are trying to do the wrong things. `go get` is very simple, but the kind of things I described doing for open-source development is more complicated. Having grown up under a different set of circumstances, perhaps the paradigm is just completely different than what we're used for. Which might not be a bad thing. So let's get into the mind of a Google developer.

Famously, Google works with a monorepo. Developers generally commit directly onto the mainline. Feature flags are preferred to feature branches. For each dependency that is required, there is a single canonical version that is checked into the mainline. When libraries need to be updated, that is done with a single commit. For that commit to succeed, the tests must pass not only for the library itself, but also for all the projects that use the library.

In this Googly world, people really don't have to think about versions very much. Since everyone is just looking at the mainline HEAD, the overriding priority is to make sure that *everything* in the monorepo works after each commit. As a result, they emphasize test coverage and their CD infrastructure over versioning. Compared to working in such a monorepo, developing open-source software, integrating multiple projects seems like [a pain](https://github.com/chrisvana/repobuild/wiki/Motivation). So its no surprise that Googlers would not really want to implement a system that adopts this somewhat painful process.

### Verdict

Pros: 

+ Simple, no worrying about versions
+ Standard, well-known workflow
+ Works pretty well when dependency updates can be controlled

Cons: 

- Build will break if *any* dependency makes a breaking change
- If a project is deleted from Github, the build would break and it might be difficult to fix
- Awkward to work with forked repos

## Vendoring - "do the simplest thing that could possibly work (if you're not sure what to do yet)"

Go 1.6 introduced vendoring, which allows you to install dependencies into the `vendor/` directory in your project. Dependencies in that folder will supersede dependencies in the `$GOPATH`. There is no support built into the language itself for how to install the dependencies, nor is there any support for versions of those vendored dependencies. But, including dependencies in a vendor folder is at least enough to make builds reproducible, provided that we check the vendored dependencies into version control. Like this, the build will no longer break due to dependency updates.

If the libraries have their own independent versions, then by including them we are lowering the cohesion of our repository. If we are running a standalone application, the consequences of this are perhaps something we can live with: 
 - Holding more duplicated copies of libraries between projects. A tool like Maven can store a specific versions of a library in a local cache or just in a remote repository  which might be preferable
 - Adds spurious commits with large changesets for dependency updates, which makes it harder to parse the repo history 
 - Makes it possible for developers to add changes to dependencies by directly monkey-patching in our repo

However, if we are building a library we can create more serious issues. If packages in the `vendor/` folder themselves have a `vendor/` folder these would also be added to the $GOPATH. This is all well and good [until the same dependency is in the main project and one of the dependencies](https://github.com/mattfarina/golang-broken-vendor). If this happens the build will break. the Go toolchain only allows one version of a package on the classpath and doesn't have any means to resolve conflicts. As a result, its generally discouraged from vendoring dependencies in libraries. 

For libraries, it would be OK to leave them without dependencies checked in if there were some way to express version preferences. Then the consuming application could be responsible for holding all the vendored dependencies. Package managers normally handle this process of dependency resolution  in other languages via tools like Maven, Ivy and pip. So, we also need a similar tool for Go. Fortunately developers have been busy building a whole plethora of dependency management tools. 

### Verdict

Pros:

+ Simple to understand, no extra setup needed
+ Reproducible builds for applications, and not vulnerable to third-party updates

Cons:
 
- No help in setting up and updating dependencies
- Libraries are problematic
- Dirtying the source repository

## Reproducible Builds With Glide et al.

Glide is a tool that brings (most of) the best practices of dependency management from other languages into Go. [This article](https://medium.com/@sdboyer/so-you-want-to-write-a-package-manager-4ae9c17d9527#.vncgoe4yu) written by one of the authors of Glide explains the design thinking behind Glide pretty well. Similar ideas seem to be driving the design of other tools like godeps and gb, but glide seems to be one of the most mature out there.

Adding a new dependency with `glide get` will add a reference in the glide.yaml with the package path, and will add the current commit from the HEAD of the default branch into the glide.lock. `glide.yaml` represents the dependency preferences being expressed by the software, and `glide.lock` represents the specific versions resolved by glide, that are used in the build. When someone else downloads the repository, that can be sure to use the same version as you by running `glide install`, which installs dependencies based on `glide.lock`. Glide can also install dependencies into the `vendor/` folder, so if you check that in you have no reason to run `glide install` at all.

It is also possible to specify acceptable version ranges in the glide.yaml, which will constrain the dependency resolution performed by `glide update`. Versioning information about repos is obtained by inspecting git tags with the standard format `v[0-9]+(.[0-9]+(.[0-9]+)?)?`. Another nice feature is the ability to specify repository aliases for your dependencies - so if you are maintaining a forked dependency you can just add the alias to glide.yaml instead of rewriting all your imports.

### Flattening

Although this allows a library to specify its own version dependencies (Glide will also manage transitive dependencies using glide.yaml) it does not solve the problem with libraries having their own vendored dependencies. This could be required if the library can also be distributed as an executable. In this case, glide needs to resolve a single version of each package and make it easy to manage that set. There are some complexities here (as there always are with transitive dependencies) but what we want is a single version of a dependency in the project `vendor/` folder, or an error if an unresolvable conflict is found. So, even if a conflict is present between vendored dependencies, Glide should be able to fix that by redoing the dependency resolution and removing the obsoleted vendor packages. Glide has a solution for this with the `--strip-vendor` option, but this is perhaps one area where the default behaviour is too conservative. There is some good discussion on these issues [here](https://github.com/Masterminds/glide/issues/303).

### Verdict

Pros: 

+ Aliasing makes working with forks easier
+ Versioning allows for resolution and conflict-avoidance for transitive dependencies
+ [SemVer is good](http://engineeredweb.com/blog/2015/go-packages-need-release-versions/) for distributing software

Cons: 

- Lots of flags to work with, default behaviour isn't always what you want or need
- Not all conflicts can be fixed, updating versions can still be painful
- Non-standard (but seems to be gaining popularity)

## A DIY Approach For Monorepo Enthusiasts

With Glide, we can finally build a project to do reproducible builds regardless of whether our project is a executable, a library, or both. Specifying versions, we can get away from some of the pain of managing a large dependency tree manually. However, there is a lot of complexity we now have to manage, and while dealing with complexity is often a sign of a robust approach to making software, we might wish to be in the position of the Google developers who seem to have a much easier time. And if you're still not convinced, perhaps [this article](https://danluu.com/monorepo/) extolling the virtues of monorepos might be enough to convince you.

There are some good reasons why constructing a monorepo might be reckless for an average organization. At Google, there has been a large investment in CD and testing which helps to track the impact of changes and ensures that commits don't break things. Without this investment, things could be quite hairy, as an errant commit could break not just one project, but all the downstream projects as well. Even Twitter [had problems](http://engineeredweb.com/blog/2015/go-packages-need-release-versions/) with implementing their monorepo (monorepi, at one point). 

Nevertheless, for the adventurous developer with an appetite for testing and an aversion to versions, I'd like to suggest an alternative model that she could use. There seems to be less tooling dedicated to maturing this monorepo-based approach, but it *could* work:

- There will be an alternative to `go get` which will fork the original project into your Organization's account if the fork does not already exist (this will also fork transitive dependencies)
- Each new project using a forked dependency will register itself as a user of that dependency (this could be a config file in the dependency repo) 
- We will create a glide.yaml which provides an alias to the forked repo
- Updates to each dependency must go through a PR process which triggers tests for each dependent project as a pre-requisite to acceptance
- Should be able to update client code and dependency in a single atomic commit whenever breaking changes occur

These start off sounding pretty easy, but the last two points cover a lot of ground. The last point in particular is always cited as one of the big wins of monorepo systems and it is likely to be especially tricky to get working across multiple git repos. But, if you're not put off by that, this approach is for you! Or, maybe you can find a better approach! There are lots of benefits to using a monorepo. It's unfortunate that its still so difficult right now.

### Verdict

Pros:

+ Will end up with a simpler well-known workflow
+ No-one likes versions
+ A little ambition is not a bad thing
+ YOLO

Cons:

- This is a long road, full of pain and suffering
- You might end up writing your own VCS
