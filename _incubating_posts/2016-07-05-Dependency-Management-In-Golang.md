Dependency Management in Golang: Mutable Packages and Monorepos

Default: Github is your monorepo

By default, golang dependencies are downloaded with go get. Go get will resolve all the import paths in your codebase as URLs pointing to Github, Bitbucket, Google or Golang repos. 90% of the time, the dependencies are github projects. In this case, the project will be cloned and the version used will be the HEAD of the default branch. 

Pros:
+ Simple, no worrying about versions
+ Standard, well-known workflow

Cons:
- Build will break all the time when any dependency makes a breaking change
- Build could permanently break if a project is deleted from github

Reproducible Builds With Glide et al.

Glide is a tool that brings (most of) the best practices of dependency management from other languages into golang. [This article](https://medium.com/@sdboyer/so-you-want-to-write-a-package-manager-4ae9c17d9527#.vncgoe4yu) written by one of the authors of glide explains the design thinking behing glide pretty well. Similar ideas seem to be driving the design of other tools like godeps and gb. 

What is still missing in golang is the idea of immutable packages. Although glide is able to download from a specific commit, and specific version ranges identifiable by git tags, it still relies on being able to download repos from github. Fortunately, Golang 1.5 defines a standard for vendoring, which is a 'good enough' solution, and dovetails nicely with glide.

Vendoring: So Golang

By default, glide downloads all your dependencies into a project-specific vendor folder. Although glide itself makes no assumptions about whether this will be checked into version control, to achieve control over the dependencies, they must be.

Compared to downloading dependencies only at build time, this has some drawbacks:
 - Bloated workspace resulting from each dependency holding its own copy of dependencies (not sure about the process, but hopefully the duplicatd packages can be excluded fromt he compilation)
 - Introduces the temptation to just make little fixes directly to the dependency. Then next time you update the dependency, things dont work any more ... ARRRGGGG






More reading

http://engineeredweb.com/blog/2015/go-packages-need-release-versions/

http://engineeredweb.com/blog/2016/monorepo-dangers/

https://divan.github.io/posts/leftpad_and_go/


