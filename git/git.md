

// 当用本地创建并且拉取本地分支时，新创建的本地分支缺少与远程分支的某些文件，可以尝试使用一下命令
git remote        # 列出所有远程主机
git remote update origin --prune   # 更新远程主机origin 整理分支
git branch -r      # 列出远程分支
git branch -vv     # 查看本地分支和远程分支对应关系
git checkout -b gpf origin/gpf    # 新建本地分支gpf与远程gpf分支相关联
git remote set-url origin

// git创建本地分支，推送到远程
git checkout -b 分支名 
git push origin 远程分支

