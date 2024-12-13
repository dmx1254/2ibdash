import * as sdk from "node-appwrite";

export const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env;

const client = new sdk.Client();

// client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("668abbec0021f4359db7")
  .setKey(
    "a40f191d5920efdad234b0492202c8af19910ac034c8317bd99f6c32bdee8f4152f390c9eb95885a82709a17cdaed99a19965bf3d353b68ac808baccb5124dedc86a0bd4d0710f7219e53fd34d436141d41147d74d2e37e9d64c0808d397415b5fa003d16bb586a76c08ae2b1fcb6a31c51623e807e7504c4b106b0308e26118"
  );

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);


