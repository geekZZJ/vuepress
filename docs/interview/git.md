# Git

## git reset

`reset`用于回退版本，可以遗弃不再使用的提交。执行遗弃时，需要根据影响的范围而指定不同的参数，可以指定是否复原索引或工作树内容
![git reset](/git/reset.png "git reset")
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

![参数区别](/git/1.png "参数区别")

## git revert

在当前提交后面，新增一次提交，抵消掉上一次提交导致的所有变化，不会改变过去的历史，主要是用于安全地取消过去发布的提交
![git revet](/git/revert.png "git revert")
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
