# Git

## git reset

`reset`用于回退版本，可以遗弃不再使用的提交。执行遗弃时，需要根据影响的范围而指定不同的参数，可以指定是否复原索引或工作树内容
![git reset](/git/reset.png 'git reset')
当没有指定`ID`的时候，默认使用`HEAD`，如果指定`ID`，那么就是基于指向`ID`去变动暂存区或工作区的内容

```bash
// 没有指定ID, 暂存区的内容会被当前ID版本号的内容覆盖，工作区不变
git reset

// 指定ID，暂存区的内容会被指定ID版本号的内容覆盖，工作区不变
git reset <commit-id>
```

日志`ID`可以通过查询，可以`git log`进行查询

常见命令如下：

- --mixed（默认）：默认的时候，只有暂存区变化
- --hard 参数：如果使用`--hard`参数，那么工作区也会变化
- --soft：如果使用`--soft`参数，那么暂存区和工作区都不会变化

![参数区别](/git/1.png '参数区别')

## git revert

在当前提交后面，新增一次提交，抵消掉上一次提交导致的所有变化，不会改变过去的历史，主要是用于安全地取消过去发布的提交
![git revet](/git/revert.png 'git revert')
跟`git reset`用法基本一致，`git revert`撤销某次操作，此次操作之前和之后的`commit`和`history`都会保留，并且把这次撤销，作为一次最新的提交，如下：

```bash
git revert <commit_id>
```

如果撤销前一个版本，可以通过如下命令：

```bash
git revert HEAD
```

撤销前前一次，如下：

```bash
git revert HEAD~1
```

## git reset 和 git revert 区别

撤销（revert）被设计为撤销公开的提交（比如已经 push）的安全方式，reset 被设计为重设本地更改

因为两个命令的目的不同，它们的实现也不一样：`reset`完全地移除了一堆更改，而`revert`保留了原来的更改，用一个新的提交来实现撤销

两者主要区别如下：

- `git revert`是用一次新的`commit`来回滚之前的`commit`，`git reset`是直接删除指定的`commit`
- `git reset`是把`HEAD`向后移动了一下，而`git revert`是`HEAD`继续前进，只是新的`commit`的内容和要`revert`的内容正好相反，能够抵消要被`revert`的内容
- 在回滚这一操作上看，效果差不多。但是在日后继续`merge`以前的老版本时有区别

## git merge

通过`git merge`将当前分支与`xxx`分支合并，产生的新的`commit`对象有两个父节点

如果“指定分支”本身是当前分支的一个直接子节点，则会产生快照合并

举个例子，`bugfix`分支是从`master`分支分叉出来的，如下所示：
![git merge](/git/merge1.png 'git merge')

合并`bugfix`分支到`master`分支时，如果`master`分支的状态没有被更改过，即`bugfix`分支的历史记录包含`master`分支所有的历史记录，所以通过把`master`分支的位置移动到`bugfix`的最新分支上，就完成合并

如果`master`分支的历史记录在创建`bugfix`分支后又有新的提交，如下情况：
![git merge](/git/merge2.png 'git merge')

这时候使用`git merge`的时候，会生成一个新的提交，并且`master`分支的`HEAD`会移动到新的分支上，如下：
![git merge](/git/merge3.png 'git merge')

从上面可以看到，会把两个分支的最新快照以及二者最近的共同祖先进行三方合并，合并的结果是生成一个新的快照

## git rebase

`master`分支的历史记录在创建`bugfix`分支后又有新的提交，如下情况：
![git merge](/git/merge2.png 'git merge')

通过`git rebase`，会变成如下情况：
![git rebase](/git/rebase1.png 'git rebase')

在移交过程中，如果发生冲突，需要修改各自的冲突，如下：
![git rebase](/git/rebase2.png 'git rebase')

`rebase`之后，`master`的`HEAD`位置不变。因此，要合并`master`分支和`bugfix`分支
![git rebase](/git/rebase3.png 'git rebase')

从上面可以看到，`rebase`会找到不同的分支的最近共同祖先，如上图中的`B`

然后对比当前分支相对于该祖先的历次提交，提取相应的修改并存为临时文件（老的提交`X`和`Y`也没有被销毁，只是简单地不能再被访问或者使用）

然后将当前分支指向目标最新位置`D`, 然后将之前另存为临时文件的修改依序应用

## git merge 与 git rebase 的区别

从上面可以看到，`merge`和`rebase`都是合并历史记录，但是各自特性不同：

### merge

通过`merge`合并分支会新增一个`merge commit`，然后将两个分支的历史联系起来

其实是一种非破坏性的操作，对现有分支不会以任何方式被更改，但是会导致历史记录相对复杂

### rebase

`rebase`会将整个分支移动到另一个分支上，有效地整合了所有分支上的提交

主要的好处是历史记录更加清晰，是在原有提交的基础上将差异内容反映进去，消除了`git merge`所需的不必要的合并提交
