import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";

const Profile = async () => {
    const session = await auth();

    if (!session?.user) {
        redirect('/');
    }


    return (
        <>
            <Title title="Perfil" />

            <pre>{ JSON.stringify(session.user, null, 4) }</pre>

            <h3 className="text-3xl mb-10">{ session.user.role }</h3>
        </>
    );
}

export default Profile;