import React from 'react';
import FormPage from './FormPage';

class AdditionalQuestionsForm extends FormPage {

  render() {

    return (
      <div>

        {this.menu('AdditionalQuestions')}

        <h2>Manner of Death</h2>

        Did tobacco use contribute to death?: <br/>
        {this.radio('tobacco', '373066001')} Yes<br/>
        {this.radio('tobacco', '373067005')} No<br/>
        {this.radio('tobacco', '2931005')} Probably<br/>
        {this.radio('tobacco', 'UNK')} Unknown<br/><br/>

        If female: <br/>
        {this.radio('pregnancy', 'PHC1260')} Not pregnant within past year<br/>
        {this.radio('pregnancy', 'PHC1261')} Pregnant at time of death<br/>
        {this.radio('pregnancy', 'PHC1262')} Not pregnant, but pregnant within 42 days of death<br/>
        {this.radio('pregnancy', 'PHC1263')} Not pregnant, but pregnant 43 days to 1 year before death<br/>
        {this.radio('pregnancy', 'PHC1264')} Unknown if pregnant within the past year<br/><br/>

        Manner of Death: <br/>
        {this.radio('mannerOfDeath', '38605008')} Natural<br/>
        {this.radio('mannerOfDeath', '27935005')} Homicide<br/>
        {this.radio('mannerOfDeath', '7878000')} Accident<br/>
        {this.radio('mannerOfDeath', '44301001')} Suicide<br/>
        {this.radio('mannerOfDeath', '185973002')} Pending Investigation<br/>
        {this.radio('mannerOfDeath', '65037004')} Could not be Determined<br/>

        <input type="button" name="submit" value="Submit" onClick={() => this.props.gotoStep('Validate')} />
    
      </div>
    );
  }

}

export default AdditionalQuestionsForm;
