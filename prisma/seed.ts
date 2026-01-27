// Seed script to populate database with mock flight data
// Creates realistic seat layout with mock passengers

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const FLIGHT_NUMBER = 'AA1234'
const ROWS = 30
const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F']

// Mock passenger data for realistic dating/social matching
const MOCK_AGES = [22, 24, 26, 28, 30, 32, 35, 38, 42, 45, 48, 52, 55, 58, 61]
const MOCK_GENDERS = ['man', 'woman', 'non_binary']
const MOCK_RELATIONSHIP = ['single', 'dating', 'married', 'complicated']
const MOCK_LOOKING_FOR = ['romance', 'friendship', 'networking', 'not_looking']
const MOCK_VIBES = ['adventurous', 'creative', 'intellectual', 'sporty', 'foodie', 'bookworm']

function getRandomAge(): number {
  return MOCK_AGES[Math.floor(Math.random() * MOCK_AGES.length)]
}

function getRandomGender(): string {
  return MOCK_GENDERS[Math.floor(Math.random() * MOCK_GENDERS.length)]
}

function getRandomRelationship(): string {
  return MOCK_RELATIONSHIP[Math.floor(Math.random() * MOCK_RELATIONSHIP.length)]
}

function getRandomLookingFor(): string {
  // 40% looking for something, 60% not looking
  return Math.random() < 0.4 ? MOCK_LOOKING_FOR[Math.floor(Math.random() * 3)] : 'not_looking'
}

function getRandomVibes(): string {
  // Select 1-3 random vibes
  const count = Math.floor(Math.random() * 3) + 1
  const shuffled = [...MOCK_VIBES].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).join(',')
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.seatAssignment.deleteMany()
  await prisma.preferences.deleteMany()
  await prisma.seat.deleteMany()
  await prisma.booking.deleteMany()

  console.log('✅ Cleared existing data')

  // Create seats
  const seats = []
  for (let row = 1; row <= ROWS; row++) {
    for (const column of COLUMNS) {
      // Randomly occupy some seats (~60% occupancy)
      const isOccupied = Math.random() < 0.6
      const isAvailable = !isOccupied

      // Rows 5, 12, 20 have children nearby
      const isNearChild = [5, 12, 20].includes(row)

      // Exit rows: 10, 21
      const isExitRow = [10, 21].includes(row)

      // Window seats: A and F
      const isWindow = column === 'A' || column === 'F'

      // Aisle seats: C and D
      const isAisle = column === 'C' || column === 'D'

      // Price: base $50, +$20 for exit row, +$10 for window, -$15 if near child
      let price = 50
      if (isExitRow) price += 20
      if (isWindow) price += 10
      if (isNearChild) price -= 15

      const seat = {
        flightNumber: FLIGHT_NUMBER,
        row,
        column,
        isAvailable,
        isNearChild,
        isExitRow,
        isWindow,
        isAisle,
        price,
        occupiedByAge: isOccupied ? getRandomAge() : null,
        occupiedByGender: isOccupied ? getRandomGender() : null,
        occupiedByRelationship: isOccupied ? getRandomRelationship() : null,
        occupiedByLookingFor: isOccupied ? getRandomLookingFor() : null,
        occupiedByVibes: isOccupied ? getRandomVibes() : null,
      }

      seats.push(seat)
    }
  }

  await prisma.seat.createMany({
    data: seats,
  })

  const availableSeats = seats.filter(s => s.isAvailable).length
  const occupiedSeats = seats.filter(s => !s.isAvailable).length

  console.log(`✅ Created ${seats.length} seats`)
  console.log(`   - Available: ${availableSeats}`)
  console.log(`   - Occupied: ${occupiedSeats}`)
  console.log(`   - Near children: ${seats.filter(s => s.isNearChild).length}`)
  console.log(`   - Exit rows: ${seats.filter(s => s.isExitRow).length}`)
  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
