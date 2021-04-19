package com.qap.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A QuestionLikes.
 */
@Entity
@Table(name = "question_likes")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class QuestionLikes implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties(value = { "answers", "companies", "tags", "questionLikes", "users", "subTopic" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Questions questions;

    @JsonIgnoreProperties(value = { "questions", "questionLikes", "answerLikes" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Users users;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public QuestionLikes id(Long id) {
        this.id = id;
        return this;
    }

    public Questions getQuestions() {
        return this.questions;
    }

    public QuestionLikes questions(Questions questions) {
        this.setQuestions(questions);
        return this;
    }

    public void setQuestions(Questions questions) {
        this.questions = questions;
    }

    public Users getUsers() {
        return this.users;
    }

    public QuestionLikes users(Users users) {
        this.setUsers(users);
        return this;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof QuestionLikes)) {
            return false;
        }
        return id != null && id.equals(((QuestionLikes) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "QuestionLikes{" +
            "id=" + getId() +
            "}";
    }
}
