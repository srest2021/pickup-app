import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ScrollView, View, Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import Avatar from './Avatar'

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`display_name, bio, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setDisplayName(data.display_name)
        setBio(data.bio)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    display_name,
    bio,
    avatar_url,
  }: {
    display_name: string
    bio: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        display_name,
        bio,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView className="p-12 mt-0">
      <View className="mt-20 py-4 self-stretch">
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View className="py-4 self-stretch">
        <Input label="Display Name" value={displayName || ''} onChangeText={(text: string) => setDisplayName(text)} />
      </View>
      <View className="py-4 self-stretch">
        <Input label="Bio" value={bio || ''} onChangeText={(text: string) => setBio(text)} />
      </View>
      <View className="items-center">
        <Avatar
            size={200}
            url={avatarUrl}
            onUpload={(url: string) => {
            setAvatarUrl(url)
            updateProfile({ display_name: displayName, bio, avatar_url: url })
            }}
        />
      </View>

      <View className="mt-10 py-4 self-stretch">
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ display_name: displayName, bio, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      <View className="py-4 self-stretch">
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </ScrollView>
  )
}