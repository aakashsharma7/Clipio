import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isPublic = searchParams.get('public')

    let query = supabase
      .from('collections')
      .select(`
        *,
        assets(count)
      `)
      .eq('user_id', session.user.sub)
      .order('created_at', { ascending: false })

    if (isPublic === 'true') {
      query = query.eq('is_public', true)
    }

    const { data, error } = await query

    if (error) throw error

    // Transform data to include asset count
    const collections = data?.map(collection => ({
      ...collection,
      asset_count: collection.assets?.[0]?.count || 0
    }))

    return NextResponse.json({ collections })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, color, is_public } = body

    const { data, error } = await supabase
      .from('collections')
      .insert({
        user_id: session.user.sub,
        name,
        description,
        color: color || generateRandomColor(),
        is_public: is_public || false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ collection: data })
  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, description, color, is_public } = body

    // Verify ownership
    const { data: existingCollection } = await supabase
      .from('collections')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existingCollection || existingCollection.user_id !== session.user.sub) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('collections')
      .update({
        name,
        description,
        color,
        is_public,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ collection: data })
  } catch (error) {
    console.error('Error updating collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Collection ID required' }, { status: 400 })
    }

    // Verify ownership
    const { data: existingCollection } = await supabase
      .from('collections')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existingCollection || existingCollection.user_id !== session.user.sub) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete associated assets first
    await supabase
      .from('assets')
      .delete()
      .eq('collection_id', id)

    // Delete collection
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateRandomColor(): string {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
    '#43e97b', '#38f9d7', '#fa709a', '#fee140', '#a8edea', '#fed6e3'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
