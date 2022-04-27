import React, { useState } from "react";
import "./UserProfile.css";
import { useNavigate, useParams } from "react-router-dom";

import { getUser } from "../services/user";
import { useAuth } from "../providers/AuthProvider";
import { addFriend, removeFriend } from "../services/friend";
import { useAsyncEffect } from "../utils/extra-hooks";
import { AiFillMessage } from "react-icons/ai";
import { MdPeople } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import FriendButton from "../components/FriendButton";
import { User } from "../services/user";
import { LoadingPlaceholder } from "../components/LoadingPlaceholder";
import SimpleButton from "../components/SimpleButton";

export interface UserProfileOutletContext {
	uid: string;
	isFriend: boolean;
	isHimself: boolean;
	friendAction: () => void;
	user: User;
}

export default function UserProfile() {
	const [user, setUser] = useState<User>({} as User);

	const id = useParams().id!;
	const { id: mainUid } = useAuth().user!;
	const isHimself = id === mainUid;

	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useAsyncEffect(
		async (stillMounted) => {
			setIsLoading(true);

			const user = await getUser(id);

			if (stillMounted()) {
				setUser(user);
				setIsLoading(false);
			}
		},
		[id]
	);

	const friendAction = () => {
		setUser(({ isFriend, ...user }) => ({ ...user, isFriend: !isFriend }));
		(user.isFriend ? removeFriend : addFriend)(id);
	};

	const editProfile = () => {
		navigate("/edit");
	};

	const outlet: UserProfileOutletContext = {
		uid: id,
		isFriend: user.isFriend,
		isHimself,
		friendAction,
		user,
	};

	return (
		<div className="responsive-container">
			<div className="user-profile">
				{isLoading ? (
					<LoadingPlaceholder />
				) : (
					<>
						<article className="user-info">
							<div className="user-name-avatar">
								<div className="profile-avatar">
									<img src={user.avatarLink} alt={user.name} />
								</div>
								<div>
									<h3 className="user-name">{user.displayName}</h3>
									<h4 className="user-pseudo">@{user.name}</h4>
								</div>
							</div>
							<p className="description">{user.description}</p>
						</article>

						<div>
							{isHimself ? <SimpleButton label="Editer le profil" onClick={editProfile} /> : (
								<FriendButton
									onClick={() => friendAction()}
									isFriend={user.isFriend}
								/>
							)}
						</div>

						<nav className="profile-nav">
							<NavLink className="profile-link" to="messages">
								<AiFillMessage /> Messages
							</NavLink>
							<NavLink className="profile-link" to="friends">
								<MdPeople /> Amis
							</NavLink>
						</nav>

						<section className="content">
							<Outlet context={outlet} />
						</section>
					</>
				)}
			</div>
		</div>
	);
}
