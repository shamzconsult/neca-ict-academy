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
    sortOrder: doc.sortOrder ?? 0,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}

export async function getAnnouncements(options?: { includeHidden?: boolean }) {
  await connectViaMongoose();

  const filter = options?.includeHidden ? {} : { hidden: { $ne: true } };

  const items = await Announcement.find(filter)
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  return items.map((doc) => serializeAnnouncement(doc));
}
