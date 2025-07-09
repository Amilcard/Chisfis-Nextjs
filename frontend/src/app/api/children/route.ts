import { NextRequest, NextResponse } from 'next/server'
import childrenService from 'frontend/src/lib/children-service'

// GET /api/children - Récupérer les enfants d'un parent
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')

    if (!parentId) {
      return NextResponse.json(
        { message: 'Parent ID requis' },
        { status: 400 }
      )
    }

    const children = await childrenService.getChildrenByParent(parentId)
    
    return NextResponse.json({
      children,
      count: children.length
    })

  } catch (error) {
    console.error('Erreur GET /api/children:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST /api/children - Créer un nouvel enfant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { parentId, ...childData } = body

    if (!parentId) {
      return NextResponse.json(
        { message: 'Parent ID requis' },
        { status: 400 }
      )
    }

    // Validation des données requises
    if (!childData.name || !childData.dateOfBirth) {
      return NextResponse.json(
        { message: 'Nom et date de naissance requis' },
        { status: 400 }
      )
    }

    const newChild = await childrenService.createChild(parentId, childData)
    
    return NextResponse.json(
      { 
        message: 'Enfant créé avec succès',
        child: newChild
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur POST /api/children:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création de l\'enfant' },
      { status: 500 }
    )
  }
}
