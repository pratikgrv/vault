import { authClient } from "@/lib/auth-client";
import React, { useState, useEffect } from "react";

const UserInfoEdit = ({ user }: { user: any }) => {
	const {
		data: session,
		isPending: isSessionPending, //loading state for session
		error: sessionError, //error object for session
		refetch: refetchSession, //refetch the session
	} = authClient.useSession();
	console.log(session);
	const [name, setName] = useState(user.name);
	const [username, setUsername] = useState(user.username); // Assuming username can also be updated
	const [image, setImage] = useState<string | undefined>(user.image);
	const [isUpdating, setIsUpdating] = useState(false);
	const [updateError, setUpdateError] = useState<Error | null>(null);

	// const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	if (e.target.files && e.target.files[0]) {
	// 		// In a real application, you would upload this file to a storage service
	// 		// and then update the 'image' state with the returned URL.
	// 		// For this example, we'll just set a placeholder or read it as a data URL.
	// 		// A more robust solution would involve a dedicated image upload API.
	// 		const file = e.target.files[0];
	// 		const reader = new FileReader();
	// 		reader.onloadend = () => {
	// 			setImage(reader.result as string); // This is a data URL, not suitable for direct authClient update
	// 		};
	// 		reader.readAsDataURL(file);
	// 		// For simplicity and direct authClient update, we might just use a static URL
	// 		// or skip updating the image directly here if a real upload is not implemented.
	// 		// For now, let's assume `authClient.updateUser` expects a URL string.
	// 		// If we update with a data URL, it might not be what the backend expects.
	// 		// A proper implementation would upload the file and get a URL.
	// 		// For this example, we'll just keep the existing image or a placeholder if no real upload.
	// 		// Let's comment this out for now and focus on name/username.
	// 		// If image update is crucial, it needs a backend upload step.
	// 	}
	// };

	// const handleSaveChanges = async () => {
	// 	if (!session?.user) return;

	// 	setIsUpdating(true);
	// 	setUpdateError(null);
	// 	try {
	// 		await authClient.updateUser({
	// 			name: name,
	// 			username: username,
	// 			// For image, a real implementation would first upload the file
	// 			// to a storage service (e.g., S3) and then pass the resulting URL here.
	// 			// For now, we reuse the existing image or omit if not changed via a proper upload flow.
	// 			image: image, // This would ideally be a URL from an upload
	// 		});
	// 		await refetchSession(); // Refetch to get the latest user data
	// 	} catch (err) {
	// 		console.error("Failed to update user:", err);
	// 		setUpdateError(err as Error);
	// 	} finally {
	// 		setIsUpdating(false);
	// 	}
	// };

	// if (isSessionPending) {
	// 	return <div>Loading user data...</div>;
	// }

	// if (sessionError) {
	// 	return <div>Error loading user data: {sessionError.message}</div>;
	// }

	return (
		<div className="flex flex-col space-y-4 w-full">
			{/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
			<div className="flex items-center space-x-4">
				{user.image ? (
					<img
						src={user.image}
						alt={user.name || "User avatar"}
						className="h-12 w-12 shrink-0 rounded-full object-cover object-center"
					/>
				) : (
					<div className="h-12 w-12 shrink-0 rounded-full bg-linear-to-br from-blue-500 to-blue-400" />
				)}
				{/* <label className="relative cursor-pointer h-8 w-full select-none appearance-none items-center justify-center rounded-lg border border-border px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:scale-[0.98]">
					<input type="file" className="sr-only" onChange={handleImageChange} />
					Change Image
				</label> */}
			</div>
			<div className="space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="name"
						className="block text-sm font-medium text-muted-foreground"
					>
						Name
					</label>
					<input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="username"
						className="block text-sm font-medium text-muted-foreground"
					>
						Username
					</label>
					<input
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
					/>
				</div>

				{updateError && (
					<p className="text-red-500 text-sm">{updateError.message}</p>
				)}

				<button
					className="relative h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-border px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:scale-[0.98] disabled:opacity-50"
					type="button"
					onClick={async () => {
						setIsUpdating(true);
						setUpdateError(null);
						try {
							await authClient.updateUser({
								name: name,
								username: username,
								// image: image,
							});
							await refetchSession();
						} catch (err: any) {
							setUpdateError(err);
						} finally {
							setIsUpdating(false);
						}
					}}
					disabled={isUpdating}
				>
					{isUpdating ? "Updating..." : "Update"}
				</button>
			</div>
		</div>
	);
};
export default UserInfoEdit;
