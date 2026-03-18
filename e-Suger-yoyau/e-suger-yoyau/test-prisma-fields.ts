import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
  console.log('--- Testing Prisma Client for isClosed field ---')
  try {
    // 実際にデータベースには書き込まず、型とエンジンの解釈を確認するために試しにデータを作成しようとしてみる
    // validateOnly的な機能はないため、実際には実行せず定義の存在を確認
    const holidayModel = (prisma as any).holiday
    console.log('Holiday model exists:', !!holidayModel)
    
    // 定義のメタデータを確認（内部プロパティなのでバージョンによって異なる可能性あり）
    const fields = (prisma as any)._dmmf?.modelMap?.Holiday?.fields
    if (fields) {
      const isClosedField = fields.find((f: any) => f.name === 'isClosed')
      console.log('isClosed field in DMMF:', isClosedField ? 'Found' : 'NOT FOUND')
    } else {
      console.log('Could not access DMMF modelMap')
    }
  } catch (e) {
    console.error('Test error:', e)
  } finally {
    await prisma.$disconnect()
  }
}

test()
