import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Partner {
  id: string;
  name: string;
  type: string;
  description: string;
  logoUrl: string;
  projectCount: number;
  partnerSince: Date;
}

interface Opportunity {
  id: string;
  title: string;
  type: 'research' | 'technology' | 'distribution';
  description: string;
  duration: string;
  partnersNeeded: number;
  deadline: Date;
}

@Component({
  selector: 'app-partnerships',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './partnerships.component.html',
  styleUrl: './partnerships.component.css'
})
export class PartnershipsComponent implements OnInit {
  currentPartners: Partner[] = [
    {
      id: '1',
      name: 'AgriTech Solutions',
      type: 'Technology Provider',
      description: 'Leading provider of smart farming solutions and IoT devices for agriculture.',
      logoUrl: '/assets/images/partners/agritech.png',
      projectCount: 3,
      partnerSince: new Date('2023-01-15')
    },
    {
      id: '2',
      name: 'Green Research Institute',
      type: 'Research Organization',
      description: 'Research institute focused on sustainable farming practices and crop optimization.',
      logoUrl: '/assets/images/partners/gri.png',
      projectCount: 2,
      partnerSince: new Date('2023-03-20')
    },
    {
      id: '3',
      name: 'FreshMarket Connect',
      type: 'Distribution Partner',
      description: 'Network of premium grocery stores and organic markets.',
      logoUrl: '/assets/images/partners/freshmarket.png',
      projectCount: 5,
      partnerSince: new Date('2023-02-01')
    }
  ];

  collaborationOpportunities: Opportunity[] = [
    {
      id: '1',
      title: 'Hydroponic Efficiency Study',
      type: 'research',
      description: 'Research project to optimize nutrient usage in hydroponic systems.',
      duration: '6 months',
      partnersNeeded: 2,
      deadline: new Date('2024-06-30')
    },
    {
      id: '2',
      title: 'Smart Monitoring Integration',
      type: 'technology',
      description: 'Integration of advanced IoT sensors for real-time crop monitoring.',
      duration: '3 months',
      partnersNeeded: 1,
      deadline: new Date('2024-05-15')
    },
    {
      id: '3',
      title: 'Local Market Expansion',
      type: 'distribution',
      description: 'Partnership opportunity for expanding distribution in the local market.',
      duration: '12 months',
      partnersNeeded: 3,
      deadline: new Date('2024-07-31')
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  openPartnershipRequest(): void {
    // TODO: Implement partnership request modal
    console.log('Opening partnership request form');
  }

  viewPartnerDetails(partner: Partner): void {
    // TODO: Implement partner details view
    console.log('Viewing details for partner:', partner.name);
  }

  applyForOpportunity(opportunity: Opportunity): void {
    // TODO: Implement opportunity application process
    console.log('Applying for opportunity:', opportunity.title);
  }

  learnMore(opportunity: Opportunity): void {
    // TODO: Implement detailed opportunity view
    console.log('Learning more about:', opportunity.title);
  }
}
