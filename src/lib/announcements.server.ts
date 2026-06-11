import Announcement from "@/models/announcement";
import connectViaMongoose from "@/lib/db";

export type AnnouncementRecord = {
  _id: string;
  title: string;
  url: string;
  active: boolean;
  hidden: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

function serializeAnnouncement(doc: {
  _id: unknown;
  title?: string;
  url?: string;
  active?: boolean;
  hidden?: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}): AnnouncementRecord {
  return {
    _id: String(doc._id),
    title: doc.title ?? "",
    url: doc.url ?? "",
    active: doc.active ?? false,
    hidden: doc.hidden ?? false,
    sortOrder: doc.sortOrder ?? 1,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}

/** Reassign sortOrder to contiguous 1..n when values are invalid or duplicated. */
export async function normalizeAnnouncementSortOrders() {
  const items = await Announcement.find()
    .sort({ sortOrder: 1, createdAt: -1 })
    .select("_id sortOrder")
    .lean();

  if (items.length === 0) return;

  const needsNormalize = items.some(
    (item, index) => item.sortOrder !== index + 1,
  );
  if (!needsNormalize) return;

  await Promise.all(
    items.map((item, index) =>
      Announcement.updateOne({ _id: item._id }, { sortOrder: index + 1 }),
    ),
  );
}

export async function getAnnouncements(options?: { includeHidden?: boolean }) {
  await connectViaMongoose();

  if (options?.includeHidden) {
    await normalizeAnnouncementSortOrders();
  }

  const filter = options?.includeHidden ? {} : { hidden: { $ne: true } };

  const items = await Announcement.find(filter)
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  return items.map((doc) => serializeAnnouncement(doc));
}

export async function getNextAnnouncementSortOrder() {
  await connectViaMongoose();
  const [latest] = await Announcement.find()
    .sort({ sortOrder: -1 })
    .limit(1)
    .select("sortOrder")
    .lean();
  return ((latest?.sortOrder as number | undefined) ?? 0) + 1;
}
