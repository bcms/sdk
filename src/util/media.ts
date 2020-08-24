import { Media, MediaAggregate } from '../interfaces';

export interface MediaUtilPrototype {
  aggregate(media: Media, allMedia: Media[]): MediaAggregate;
  aggregateFromRoot(media: Media[]): MediaAggregate[];
}

export function MediaUtil(): MediaUtilPrototype {
  return {
    aggregate(media, allMedia) {
      const mediaAggregate: MediaAggregate = {
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
        for (const i in childrenIndexes) {
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
      const aggregated: MediaAggregate[] = [];
      for (const i in media) {
        if (media[i].isInRoot) {
          aggregated.push(this.aggregate(media[i], media));
        }
      }
      return aggregated;
    },
  };
}
