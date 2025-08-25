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
    const collectionId = searchParams.get('collection_id')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('assets')
      .select('*')
      .eq('user_id', session.user.sub)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (collectionId) {
      query = query.eq('collection_id', collectionId)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,tags.cs.{${search}}`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ assets: data })
  } catch (error) {
    console.error('Error fetching assets:', error)
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
    const { title, description, url, file_type, file_size, tags, collection_id } = body

    // Generate AI tags (simulated)
    const aiTags = await generateAITags(url, title, description)

    const { data, error } = await supabase
      .from('assets')
      .insert({
        user_id: session.user.sub,
        title,
        description,
        url,
        file_type,
        file_size,
        tags: tags || [],
        ai_tags: aiTags,
        collection_id,
        thumbnail_url: generateThumbnailUrl(url)
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ asset: data })
  } catch (error) {
    console.error('Error creating asset:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateAITags(url: string, title: string, description?: string): Promise<string[]> {
  // Simulated AI tagging - in production, this would call a Python AI service
  const mockTags = ['design', 'inspiration', 'creative', 'modern', 'minimal']
  const randomTags = mockTags.sort(() => 0.5 - Math.random()).slice(0, 3)
  
  // Add tags based on file type
  if (url.includes('.jpg') || url.includes('.png') || url.includes('.gif')) {
    randomTags.push('image', 'visual')
  } else if (url.includes('.mp4') || url.includes('.mov')) {
    randomTags.push('video', 'motion')
  }

  return randomTags
}

function generateThumbnailUrl(url: string): string {
  // In production, this would generate thumbnails using a service like Cloudinary
  return url
}
