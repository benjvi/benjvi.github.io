# Dependency Management in Golang, Or Why Monorepos are not for you

Ever since the inception of Go, the dependency management has worked quite differently from in other lagnuages. Although Go had the ambition to bake in a standardised dependency managment process, that process seems to have been based on the authors experience working in Google. Unfortunately, things work differently in Google than in other places, and so the default approach has always been disliked by the majority of developers. This has led to the development of a multitude of dependency management tools being developed, and as yet the community has not quite arrived at a de facto standard. This leaves the new Golang developer with some learning to do in order to choose the best tool for the job.

## Default: *Go Get Github*

By default, Go dependencies are downloaded with `go get`. Go get will resolve all the package paths in your codebase as URLs pointing to Github, Bitbucket, Google or Golang repos. 90% of the time, the dependencies are Github projects. In this case, the project will be cloned and the version used will be the HEAD of the default branch. 

When using `go get`, dependencies are copied into a single tree structure under $GOPATH/src. The structure of this tree matches the package path / repo URL structure. So, on a single Go developers machine, there is a single version of each dependency as defined by the package path which will be used by each project depending on the package. 

### Problems Doing Open-Source Projects

There are a couple of problems with this. One I discovered while I was trying to maintain a fork of the [Terraform project](github.com/hashicorp/terraform) [1]. This is a very large and active project with lots of dependencies. Every time I would do a build, new versions of the dependencies would be pulled in, and the build would break. Although there were many people around to fix the main repo, it was not uncommon for it to also be broken due for the same reason. In fairness to the terraform contributors, this is no longer the case as they introduced vendored dependencies at the start of this year. 

Using single global versions of a package also caused difficulty in maintaining a fork. I was also at times using a forked version of a dependency of Terraform, and the solutino to used forked packages is to rewrite all the import paths in your repo. This doesn't sound ideal, but what would happen was this:
  1. MAking changes in a fork, find a bug. Think that it doesn't seem like something specific to the changes I made, so decide to check Terraform master
  2. Checkout master and try to build, but build fails. 
  3. Realize that I also made changes to the dependency. Can't remember whether I made the import paths to point to the forked repo, or I cloned my forked repo in place of the original repo, so check the package paths in the Terraform source files. 
  4 . Find I made my changes in the original dependency, so that could be why master doesn't build.
  5. Checkout master in the dependency and manage to build master
  6. By this point, I forgot the problem I'd had that I was meant to be checking in master
If each package held some information about its own dependencies, making these kinds of forks that touch multiple repos would have been much easier.

There is one more problem that thankfully, I didn't encounter. Since repos on Github are not immutable, `go get` will fail if any project you're dependent on is deleted. So, #leftpadgate could also occur in Go projects. Although culturally, golang developers are less likely to import a load of small, arguably unnecessary, and more-likely-to-be-deleted dependencies, there was no protection in the toolchain. Until Go 1.6, that is, when vendoring was officially introduced.

### Why Its Like This

I like to believe that every argument has a counter-argument. And oftern the reason why things can seem difficult is that we are trying to do the wrong things. `go get` is very simple, but the kind of things I described doing for open-source development is more complicated. So let's get into the mind of a Google developer.

Famously, Google works with a monorepo (did I mention that already?). Developers generally commit directl onto the mainline. Feature flags are preferred to feature branches. For each dependecy that is required, there is a single canonical version that is checked into the mainline. When libraries need to be updated, that is done with a single commit. For that commit to succeed, the tests must pass not only for the library itself, but also for all the projects that use the library.

In this googly world, people really don't have to think about versions very much. Since everyone is just looking at the mainline HEAD, the overriding priority is to make sure that *everything* in the monorepo works after each commit. As a result, they emphasize test coverage and their CD infrastructure over versioning. Compared to working in such a monorepo, developing open-source software, integrating multiple projects seems like [a pain](https://github.com/chrisvana/repobuild/wiki/Motivation). i

### Verdict

Pros:
+ Simple, no worrying about versions
+ Standard, well-known workflow
+ Works pretty well when 
Cons:
- Build will break all the time when any dependency makes a breaking change
- Build could permanently break if a project is deleted from Github
- Difficult to use with privately-hosted repos
- Awkward to work with forked repos

## Vendoring - "do the simplest thing that could possibly work (if you're not sure what to do yet)"

Go 1.6 introduced vendoring, which allowsyou to install dependencies into the `vendor/` directory in your project. Dependencies in that folder will supercede dependencies in the `$GOPATH`. There is no support built into the language itself for how to install the dependencies, nor is there any support for versions of those vendored dependencies. But, including dependencies in a vendor folder is enough to 

Reproducible Builds With Glide et al.

Glide is a tool that brings (most of) the best practices of dependency management from other languages into Go. [This article](https://medium.com/@sdboyer/so-you-want-to-write-a-package-manager-4ae9c17d9527#.vncgoe4yu) written by one of the authors of Glide explains the design thinking behing Glide pretty well. Similar ideas seem to be driving the design of other tools like godeps and gb. 

What is still missing in Go is the idea of immutable packages. Although Glide is able to download from a specific commit, and specific version ranges identifiable by git tags, it still relies on being able to download repos from Github. Fortunately, Golang 1.5 defines a standard for vendoring, which is a 'good enough' solution, and dovetails nicely with Glide.

Vendoring: So Golang

By default, Glide downloads all your dependencies into a project-specific vendor folder. Although Glide itself makes no assumptions about whether this will be checked into version control, to achieve control over the dependencies, they must be.

Compared to downloading dependencies only at build time, this has some drawbacks:
 - Bloated workspace resulting from each dependency holding its own copy of dependencies (not sure about the process, but hopefully the duplicatd packages can be excluded fromt he compilation)
 - Introduces the temptation to just make little fixes directly to the dependency. Then next time you update the dependency, things dont work any more ... ARRRGGGG






More reading

http://engineeredweb.com/blog/2015/go-packages-need-release-versions/

http://engineeredweb.com/blog/2016/monorepo-dangers/

https://divan.Github.io/posts/leftpad_and_go/
