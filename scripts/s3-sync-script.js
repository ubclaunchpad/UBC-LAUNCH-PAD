import { GetObjectCommand, S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import fs from 'fs';
import 'dotenv/config';

const importS3Files = async function () {
	try {
		const s3 = new S3Client({
			region: 'us-west-1',
			credentials: {
				accessKeyId: process.env.AWS_STARPORT_BAR_AK ?? '',
				secretAccessKey: process.env.AWS_STARPORT_BAR_SAK ?? ''
			}
		});
		const bucketName = 'starport-bar';

		const rootDirStack = [`${process.env.REPOSITORY_ID}/`];

		// Remove old docs folder
		fs.rmSync('src/docs', { recursive: true, force: true });

		// Make new empty docs folder
		fs.mkdir('src/docs', (err) => {
			if (err) {
				console.log(`mkdir error: ${err}`);
			}
		});

		// BFS to obtain files from s3 and populate docs folder
		while (rootDirStack.length > 0) {
			const rootDir = rootDirStack.pop();

			// Get all files and subfolders that exist in current directory
			const listResponse = await s3.send(
				new ListObjectsV2Command({
					Bucket: bucketName,
					Prefix: rootDir,
					Delimiter: '/'
				})
			);

			// Files in current directory are downloaded and put inside current directory
			await listResponse.Contents?.map(async (content) => {
				const getResponse = await s3.send(
					new GetObjectCommand({
						Bucket: bucketName,
						Key: content.Key
					})
				);
				const inputStream = getResponse.Body;
				const s3Path = content.Key?.split('/');
				const downloadPath = `src/docs/${s3Path?.slice(1, s3Path.length).join('/')}` ?? 'src/docs';
				const outputStream = fs.createWriteStream(downloadPath);
				// @ts-ignore
				inputStream?.pipe(outputStream);
				outputStream.on('finish', () => {
					console.log(`downloaded ${downloadPath} successfully`);
				});
			});

			// Create subdirectories
			(await listResponse.CommonPrefixes?.forEach((prefix) => {
				const s3SubdirFolderPath = prefix.Prefix ?? '';
				const subdirDownloadFolderPath =
					`src/docs/${s3SubdirFolderPath
						?.split('/')
						.slice(1, s3SubdirFolderPath.length)
						.join('/')}` ?? 'src/docs';
				rootDirStack.push(s3SubdirFolderPath);
				fs.mkdir(subdirDownloadFolderPath, { recursive: true }, (err) => {
					if (err) {
						console.log(`mkdir error: ${err}`);
					}
				});
			})) ?? [];
		}
	} catch (error) {
		console.log(error);
	}
};

(async function main() {
	await importS3Files();
})();
