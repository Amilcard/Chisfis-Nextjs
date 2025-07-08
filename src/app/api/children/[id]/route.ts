import { NextRequest, NextResponse } from 'next/server'
import childrenService from '@/lib/children-service'

interface Context {
  params: Promise<{
    id: string
  }>
}

// GET /api/children/[id] - Récupérer un enfant spécifique
export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    
    const child = await childrenService.getChild(id)
    
    if (!child) {
      return NextResponse.json(
        { message: 'Enfant non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ child })

  } catch (error) {
    console.error('Erreur GET /api/children/[id]:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/children/[id] - Mettre à jour un enfant
export async function PUT(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const updateData = await request.json()
    
    const updatedChild = await childrenService.updateChild(id, updateData)
    
    return NextResponse.json({
      message: 'Enfant mis à jour avec succès',
      child: updatedChild
    })

  } catch (error) {
    console.error('Erreur PUT /api/children/[id]:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de l\'enfant' },
      { status: 500 }
    )
  }
}

// DELETE /api/children/[id] - Supprimer un enfant
export async function DELETE(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    
    await childrenService.deleteChild(id)
    
    return NextResponse.json({
      message: 'Enfant supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur DELETE /api/children/[id]:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de l\'enfant' },
      { status: 500 }
    )
  }
}

// PATCH /api/children/[id] - Activer/désactiver un enfant
export async function PATCH(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const { isActive } = await request.json()
    
    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { message: 'isActive doit être un booléen' },
        { status: 400 }
      )
    }
    
    const updatedChild = await childrenService.toggleChildActive(id, isActive)
    
    return NextResponse.json({
      message: `Enfant ${isActive ? 'activé' : 'désactivé'} avec succès`,
      child: updatedChild
    })

  } catch (error) {
    console.error('Erreur PATCH /api/children/[id]:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la modification du statut' },
      { status: 500 }
    )
  }
}
