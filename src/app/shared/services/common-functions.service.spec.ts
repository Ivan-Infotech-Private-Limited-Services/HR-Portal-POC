/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CommonFunctionsService } from './common-functions.service';

describe('Service: CommonFunctions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonFunctionsService]
    });
  });

  it('should ...', inject([CommonFunctionsService], (service: CommonFunctionsService) => {
    expect(service).toBeTruthy();
  }));
});
