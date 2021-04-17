import type {
  BCMSMedia,
  BCMSMediaAggregate,
  BCMSSdkMediaServicePrototype,
} from '../types';

export function BCMSSdkMediaService() {
  const self: BCMSSdkMediaServicePrototype = {
    aggregate(media, allMedia) {
      const mediaAggregate: BCMSMediaAggregate = {
        _id: media._id,
        createdAt: media.createdAt,
        updatedAt: media.updatedAt,
        isInRoot: media.isInRoot,
        mimetype: media.mimetype,
        name: media.name,
        path: media.path,
        size: media.size,
        state: false,
        type: media.type,
        userId: media.userId,
      };
      if (media.hasChildren) {
        mediaAggregate.children = [];
        const childrenIndexes: number[] = [];
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < allMedia.length; i = i + 1) {
          if (allMedia[i].parentId === media._id) {
            childrenIndexes.push(i);
          }
        }
        for (let i = 0; i < childrenIndexes.length; i++) {
          const child = allMedia[childrenIndexes[i]];
          if (child.hasChildren) {
            mediaAggregate.children.push(this.aggregate(child, allMedia));
          } else {
            mediaAggregate.children.push({
              _id: child._id,
              createdAt: child.createdAt,
              updatedAt: child.updatedAt,
              isInRoot: child.isInRoot,
              mimetype: child.mimetype,
              name: child.name,
              path: child.path,
              size: child.size,
              state: false,
              type: child.type,
              userId: child.userId,
            });
          }
        }
      }
      return mediaAggregate;
    },
    aggregateFromRoot(media) {
      const aggregated: BCMSMediaAggregate[] = [];
      for (const i in media) {
        if (media[i].isInRoot) {
          aggregated.push(this.aggregate(media[i], media));
        }
      }
      return aggregated;
    },
    getChildren(parentId, allMedia, depth) {
      if (!depth) {
        depth = 0;
      }
      if (depth > 100) {
        throw Error('Depth is > 100');
      }
      const children = allMedia.filter((e) => e.parentId === parentId);
      const output: BCMSMedia[] = [...children];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.hasChildren) {
          const childChildren = self.getChildren(
            child._id,
            allMedia,
            depth + 1,
          );
          for (let j = 0; j < childChildren.length; j++) {
            output.push(childChildren[j]);
          }
        }
      }
      return output;
    },
  };
  return self;
}
