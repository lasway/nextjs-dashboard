import { fetchUser } from '@/app/lib/data'

export default async function UserPage({ params }: { params: { id: string } }) {
    const { id } = params;
    console.log('UserPage', id)
    const user = await fetchUser(id);
    console.log('UserPage', user)
    if (!user) {
        return <p>User not found</p>
    }
    return (
        <p>{user.name}</p>
    )

}