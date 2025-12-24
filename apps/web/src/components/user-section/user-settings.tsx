import React from "react";
import UserInfoEdit from "./user-info-edit";

interface UserSettingsProps {
	user: any;
}

const UserSettings = ({ user }: UserSettingsProps) => {
	return (
		<div className="p-4">
			<UserInfoEdit user={user} />
		</div>
	);
};

export default UserSettings;